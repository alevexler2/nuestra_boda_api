import { Injectable } from '@nestjs/common';
import { MediaFileRepository } from './media-file.repository';
import { CreateMediaFileDto } from './dto/create-media-file.dto';
import { MediaFileResponseDto } from './dto/response-media-file.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MediaFileService {
  constructor(private readonly mediaFileRepo: MediaFileRepository) {}

  async create(createDto: any): Promise<MediaFileResponseDto> {
    const media = await this.mediaFileRepo.create(createDto);
    return this.toResponseDto(media);
  }

  async findAllByEvent(
    eventId: string,
  ): Promise<(MediaFileResponseDto & { data?: string })[]> {
    const medias = await this.mediaFileRepo.findAllByEvent(eventId);
    return await Promise.all(
      medias.map(async (media) => {
        const response = this.toResponseDto(media.get());
        const url = media.get('URL');
        if (!url) {
          console.warn(`⚠️ Media sin URL válida:`, media);
          response['data'] = null;
          return response;
        }

        const filePath = join(process.cwd(), media.dataValues.URL);
        try {
          const fileBuffer = await fs.promises.readFile(filePath);
          response['data'] = fileBuffer.toString('base64');
        } catch (e) {
          response['data'] = null;
        }
        return response;
      }),
    );
  }

  async findOne(id: string): Promise<MediaFileResponseDto | null> {
    const media = await this.mediaFileRepo.findOne(id);
    return media ? this.toResponseDto(media) : null;
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const media = await this.mediaFileRepo.findOne(id);

    if (!media) return { success: false, message: 'MediaFile not found' };

    const filePath = join(process.cwd(), media.dataValues.URL);
    try {
      await fs.promises.unlink(filePath);
    } catch {}
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
