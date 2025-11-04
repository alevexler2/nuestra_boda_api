import { Injectable } from '@nestjs/common';
import { MediaFileRepository } from './media-file.repository';
import { CreateMediaFileDto } from './dto/create-media-file.dto';
import { MediaFileResponseDto } from './dto/response-media-file.dto';
import { MediaFile } from './entities/media-file.entity';

@Injectable()
export class MediaFileService {
  constructor(private readonly mediaFileRepo: MediaFileRepository) {}

  async create(createDto: CreateMediaFileDto): Promise<MediaFileResponseDto> {
    const media = await this.mediaFileRepo.create(createDto);
    return this.toResponseDto(media);
  }

  async findAllByEvent(eventId: string): Promise<MediaFileResponseDto[]> {
    const medias = await this.mediaFileRepo.findAllByEvent(eventId);
    return medias.map(this.toResponseDto);
  }

  async findOne(id: string): Promise<MediaFileResponseDto | null> {
    const media = await this.mediaFileRepo.findOne(id);
    return media ? this.toResponseDto(media) : null;
  }

    async delete(id: string): Promise<{ success: boolean; message: string }> {
    const media = await this.mediaFileRepo.findOne(id);
    if (!media) {
      return { success: false, message: 'MediaFile not found' };
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
      EventID: media.EventID,
      CreatedAt: media.createdAt,
      UpdatedAt: media.updatedAt,
    };
  }

  async findOneByUrl(url: string): Promise<MediaFile | null> {
    return this.mediaFileRepo.findOneByUrl(url);
  }
}
