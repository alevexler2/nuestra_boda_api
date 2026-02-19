import { Inject, Injectable } from '@nestjs/common';
import { MediaFileRepository } from './media-file.repository';
import { MediaFileResponseDto } from './dto/response-media-file.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { GoogleAuthService } from 'src/config/google-auth.service';
import * as fs from 'fs';
import { join } from 'path';
import { google, drive_v3 } from 'googleapis';
import * as stream from 'stream';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Response } from 'express';

@Injectable()
export class MediaFileService {
  private drive: drive_v3.Drive;

  constructor(
    private readonly mediaFileRepo: MediaFileRepository,
    private readonly googleAuthService: GoogleAuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // Obtén el cliente OAuth del servicio de Google Auth
    const oauth2Client = this.googleAuthService.getAuthClient();
    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
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
    console.log(`📤 Subiendo archivo: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB) - MIME: ${file.mimetype}`);

    const folderId = await this.getOrCreateEventFolder(this.drive, eventId);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: file.originalname,
          parents: [folderId],
          description: `Uploaded: ${new Date().toISOString()}`,
        },
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
        fields: 'id, webViewLink',
      });

      const fileId = response.data.id!;
      console.log(`✅ Archivo subido correctamente. ID: ${fileId}`);

      // Dar permisos de lectura pública
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      console.log(`🔓 Permisos públicos configurados para: ${fileId}`);
      return { fileId };
    } catch (error) {
      console.error(`❌ Error subiendo archivo a Drive:`, error);
      throw error;
    }
  }

  private async downloadFileFromDrive(fileId: string): Promise<string | null> {
    const cacheKey = `video-${fileId}`;
    const cached = await this.cacheManager.get<string>(cacheKey);

    if (cached) {
      console.log(`⚡ Video ${fileId} obtenido del CACHÉ`);
      return cached;
    }

    try {
      console.log(`⬇️ Descargando video ${fileId} de Drive...`);

      const response = await this.drive.files.get(
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
          const baseUrl = process.env.API_BASE_URL || 'http://localhost:8000';
          response.streamUrl = `${baseUrl}/api/media-file/${media.get('ID')}/stream`;
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
    try {
      const media = await this.mediaFileRepo.findOne(mediaId);

      if (!media) {
        console.error(`❌ MediaFile no encontrado: ${mediaId}`);
        return res.status(404).json({ error: 'MediaFile not found' });
      }

      const fileId = media.dataValues.URL;
      console.log(`📥 Streaming video: ${fileId} (MediaID: ${mediaId})`);

      if (!fileId || fileId.includes('/')) {
        console.error(`❌ URL inválido: ${fileId}`);
        return res.status(400).json({ error: 'Invalid file ID' });
      }

      // Obtener metadatos del archivo
      const meta = await this.drive.files.get({
        fileId,
        fields: 'size, mimeType, name, trashed',
      });

      if (meta.data.trashed) {
        console.error(`❌ Archivo fue eliminado: ${fileId}`);
        return res.status(404).json({ error: 'File has been deleted' });
      }

      const fileSize = Number(meta.data.size);
      const mimeType = meta.data.mimeType || 'video/mp4';
      const fileName = meta.data.name || 'video';

      console.log(
        `📺 Archivo: ${fileName}, Tamaño: ${(fileSize / 1024 / 1024).toFixed(2)} MB, MIME: ${mimeType}`,
      );

      if (!range) {
        // Petición sin rango
        console.log(`📤 Enviando video completo: ${fileName}`);
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': mimeType,
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*',
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Cache-Control': 'public, max-age=3600',
        });

        try {
          const driveResponse = await this.drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'stream' },
          );

          return driveResponse.data.pipe(res);
        } catch (error) {
          console.error(`❌ Error en streaming completo:`, error);
          return res.status(500).json({ error: 'Error streaming file' });
        }
      }

      // Petición con rango (para skip)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      console.log(
        `📍 Rango solicitado: bytes=${start}-${end}/${fileSize} (Chunk: ${(chunkSize / 1024 / 1024).toFixed(2)} MB)`,
      );

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cache-Control': 'public, max-age=3600',
      });

      try {
        const driveResponse = await this.drive.files.get(
          { fileId, alt: 'media' },
          {
            responseType: 'stream',
            headers: {
              Range: `bytes=${start}-${end}`,
            },
          },
        );

        return driveResponse.data.pipe(res);
      } catch (error) {
        console.error(`❌ Error en streaming con rango:`, error);
        return res.status(500).json({ error: 'Error streaming file range' });
      }
    } catch (error) {
      console.error(`❌ Error general en streamVideoFromDrive:`, error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async findOne(id: string): Promise<MediaFileResponseDto | null> {
    const media = await this.mediaFileRepo.findOne(id);
    return media ? this.toResponseDto(media) : null;
  }

  private async deleteFileFromDrive(fileId: string): Promise<boolean> {
    try {
      await this.drive.files.delete({
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
