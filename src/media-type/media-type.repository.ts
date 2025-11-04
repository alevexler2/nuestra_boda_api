import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MediaType } from './entities/media-type.entity';

@Injectable()
export class MediaTypeRepository {
  constructor(
    @InjectModel(MediaType)
    private readonly mediaTypeModel: typeof MediaType,
  ) {}

  findAll(): Promise<MediaType[]> {
    return this.mediaTypeModel.findAll();
  }

  findOne(id: number): Promise<MediaType | null> {
    return this.mediaTypeModel.findByPk(id);
  }
}
