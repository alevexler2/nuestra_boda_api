import { Inject, Injectable } from '@nestjs/common';
import { MediaFileRepository } from './media-file.repository';
import { MediaFileResponseDto } from './dto/response-media-file.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import * as fs from 'fs';
import { join } from 'path';
import { google, drive_v3 } from 'googleapis';
import * as stream from 'stream';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Response } from 'express';

@Injectable()
export class MediaFileService {
  private oauth2Client;
  private drive: drive_v3.Drive;

  constructor(
    private readonly mediaFileRepo: MediaFileRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://api.pupaeventos.com/api/media-file/oauth2callback',
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  async create(createDto: any): Promise<MediaFileResponseDto> {
    const media = await this.mediaFileRepo.create(createDto);
    return this.toResponseDto(media);
  }

  private async getOrCreateEventFolder(
    drive: any,
    eventId: string,
  ): Promise<string> {
    const folderName = `Evento_${eventId}`;

    const searchResponse = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (searchResponse.data.files && searchResponse.data.files.length > 0) {
      console.log(`📂 Usando carpeta existente: ${folderName}`);
      return searchResponse.data.files[0].id!;
    }

    console.log(`📁 Creando nueva carpeta: ${folderName}`);
    const createResponse = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    console.log(`✅ Carpeta creada con ID: ${createResponse.data.id}`);
    return createResponse.data.id!;
  }

  async uploadToDrive(
    file: Express.Multer.File,
    eventId: string,
  ): Promise<{ fileId: string }> {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
    await this.oauth2Client.getAccessToken();

    const folderId = await this.getOrCreateEventFolder(drive, eventId);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
      fields: 'id',
    });

    const fileId = response.data.id!;

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return { fileId };
  }

  private async downloadFileFromDrive(fileId: string): Promise<string | null> {
    const cacheKey = `video-${fileId}`;
    const cached = await this.cacheManager.get<string>(cacheKey);

    if (cached) {
      console.log(`⚡ Video ${fileId} obtenido del CACHÉ`);
      return cached;
    }

    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

      console.log(`⬇️ Descargando video ${fileId} de Drive...`);

      const response = await drive.files.get(
        {
          fileId: fileId,
          alt: 'media',
        },
        { responseType: 'arraybuffer' },
      );

      const buffer = Buffer.from(response.data as ArrayBuffer);
      const base64 = buffer.toString('base64');

      console.log(
        `✅ Video descargado: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`,
      );

      await this.cacheManager.set(cacheKey, base64, 3600);
      console.log(`💾 Video guardado en caché`);

      return base64;
    } catch (error) {
      console.error(`❌ Error descargando archivo ${fileId}:`, error);
      return null;
    }
  }

  async findAllByEvent(
    eventId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<
    PaginatedResponseDto<
      MediaFileResponseDto & { data?: string; streamUrl?: string }
    >
  > {
    const { page = 1, limit = 10 } = paginationQuery;
    const offset = (page - 1) * limit;

    const { rows: medias, count: total } =
      await this.mediaFileRepo.findAllByEventPaginated(eventId, limit, offset);

    const data = medias.map((media) => {
      const response: any = this.toResponseDto(media.get());
      const url = media.get('URL');

      if (!url) {
        response.data = null;
        return response;
      }

      if (url.startsWith('drive://') || !url.includes('/')) {
        const fileId = url.replace('drive://', '');

        // 🖼 IMAGEN (igual que antes)
        if (media.get('MediaTypeID') === 1) {
          response.data = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        }

        // 🎥 VIDEO → STREAM (CAMBIO CLAVE)
        if (media.get('MediaTypeID') === 2) {
          response.streamUrl = `https://api.pupaeventos.com/api/media-file/${media.get('ID')}/stream`;
        }

        return response;
      }

      response.data = null;
      return response;
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async streamVideoFromDrive(mediaId: string, res: Response, range?: string) {
    const media = await this.mediaFileRepo.findOne(mediaId);

    if (!media) {
      return res.status(404).end();
    }
    const fileId = media.dataValues.URL;
    console.log(fileId);
    if (!fileId || fileId.includes('/')) {
      return res.status(400).end();
    }

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

    const meta = await drive.files.get({
      fileId,
      fields: 'size, mimeType',
    });

    const fileSize = Number(meta.data.size);
    const mimeType = meta.data.mimeType || 'video/mp4';

    if (!range) {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
      });

      const driveResponse = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' },
      );

      return driveResponse.data.pipe(res);
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': mimeType,
    });

    const driveResponse = await this.drive.files.get(
      { fileId, alt: 'media' },
      {
        responseType: 'stream',
        headers: {
          Range: `bytes=${start}-${end}`,
        },
      },
    );

    driveResponse.data.pipe(res);
  }

  async findOne(id: string): Promise<MediaFileResponseDto | null> {
    const media = await this.mediaFileRepo.findOne(id);
    return media ? this.toResponseDto(media) : null;
  }

  private async deleteFileFromDrive(fileId: string): Promise<boolean> {
    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

      await drive.files.delete({
        fileId: fileId,
      });

      console.log(`✅ Archivo ${fileId} eliminado de Drive`);
      return true;
    } catch (error) {
      console.error(`❌ Error eliminando archivo ${fileId} de Drive:`, error);
      return false;
    }
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const media = await this.mediaFileRepo.findOne(id);

    if (!media) return { success: false, message: 'MediaFile not found' };

    const url = media.dataValues.URL;

    if (url.startsWith('drive://') || !url.includes('/')) {
      const fileId = url.replace('drive://', '');

      await this.cacheManager.del(`video-${fileId}`);

      await this.deleteFileFromDrive(fileId);
    } else {
      const filePath = join(process.cwd(), url);
      try {
        await fs.promises.unlink(filePath);
      } catch {}
    }

    await this.mediaFileRepo.delete(id);
    return { success: true, message: 'MediaFile deleted successfully' };
  }

  private toResponseDto(media: any): MediaFileResponseDto {
    return {
      ID: media.ID,
      URL: media.URL,
      MediaTypeID: media.MediaTypeID,
      UploadedBy: media.UploadedBy,
      UploadedByName: media.UploadedByName,
      EventID: media.EventID,
      CreatedAt: media.createdAt,
      UpdatedAt: media.updatedAt,
    };
  }
}
