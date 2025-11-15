import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MediaFileLike } from './entities/media-file-like.entity';
import { CreateMediaFileLikeDto } from './dto/create-media-file-like.dto';

@Injectable()
export class MediaFileLikeRepository {
  constructor(
    @InjectModel(MediaFileLike)
    private readonly likeModel: typeof MediaFileLike,
  ) {}

  async create(createDto: CreateMediaFileLikeDto): Promise<MediaFileLike> {
    return this.likeModel.create(createDto);
  }

  async findAllByMediaFile(mediaFileID: string): Promise<MediaFileLike[]> {
    return this.likeModel.findAll({ where: { MediaFileID: mediaFileID }, order: [['createdAt', 'DESC']], });
  }

  async findOne(id: string): Promise<MediaFileLike | null> {
    return this.likeModel.findByPk(id);
  }

  async findOneByUserAndMediaFile(
    MediaFileID: string,
    UserEmail: string,
  ): Promise<MediaFileLike | null> {
    return this.likeModel.findOne({
      where: { MediaFileID, UserEmail },
    });
  }

  async deleteByUserAndMediaFile(
    MediaFileID: string,
    UserEmail: string,
  ): Promise<void> {
    await this.likeModel.destroy({ where: { MediaFileID, UserEmail } });
  }
}
