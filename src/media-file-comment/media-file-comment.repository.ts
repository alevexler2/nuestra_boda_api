import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MediaFileComment } from './entities/media-file-comment.entity';
import { CreateMediaFileCommentDto } from './dto/create-media-file-comment.dto';
import { InferCreationAttributes } from 'sequelize';

@Injectable()
export class MediaFileCommentRepository {
  constructor(
    @InjectModel(MediaFileComment)
    private readonly commentModel: typeof MediaFileComment,
  ) {}

  async create(createDto: CreateMediaFileCommentDto): Promise<MediaFileComment> {
    return this.commentModel.create(
      createDto as InferCreationAttributes<MediaFileComment>
    );
  }

  async findAllByMediaFile(mediaFileId: string): Promise<MediaFileComment[]> {
    return this.commentModel.findAll({
      where: { MediaFileID: mediaFileId },
      order: [['CreatedAt', 'ASC']],
    });
  }

  async findOne(id: string): Promise<MediaFileComment | null> {
    return this.commentModel.findByPk(id);
  }
}
