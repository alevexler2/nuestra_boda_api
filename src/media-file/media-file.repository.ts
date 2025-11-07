import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MediaFile } from './entities/media-file.entity';
import { CreateMediaFileDto } from './dto/create-media-file.dto';
import { InferCreationAttributes } from 'sequelize';

@Injectable()
export class MediaFileRepository {
  constructor(
    @InjectModel(MediaFile)
    private readonly mediaFileModel: typeof MediaFile,
  ) {}

  async create(createDto: CreateMediaFileDto): Promise<MediaFile> {
    return this.mediaFileModel.create(
      createDto as InferCreationAttributes<MediaFile>,
    );
  }

  async findAllByEvent(eventId: string): Promise<MediaFile[]> {
    return this.mediaFileModel.findAll({
      where: { EventID: eventId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string): Promise<MediaFile | null> {
    return this.mediaFileModel.findByPk(id);
  }

  async findOneByUrl(url: string): Promise<MediaFile | null> {
    return this.mediaFileModel.findOne({ where: { URL: url } });
  }

  async delete(id: string): Promise<void> {
    await this.mediaFileModel.destroy({ where: { ID: id } });
  }
}
