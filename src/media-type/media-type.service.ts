import { Injectable } from '@nestjs/common';
import { MediaTypeRepository } from './media-type.repository';
import { MediaTypeResponseDto } from './dto/response-media-type.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MediaTypeService {
  constructor(private readonly mediaTypeRepo: MediaTypeRepository) {}

  async findAll(): Promise<MediaTypeResponseDto[]> {
    const mediaTypes = await this.mediaTypeRepo.findAll();
    return plainToInstance(MediaTypeResponseDto, mediaTypes);
  }

  async findOne(id: number): Promise<MediaTypeResponseDto | null> {
    const mediaType = await this.mediaTypeRepo.findOne(id);
    if (!mediaType) return null;
    return plainToInstance(MediaTypeResponseDto, mediaType);
  }
}
