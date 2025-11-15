import { Injectable } from '@nestjs/common';
import { MediaFileCommentRepository } from './media-file-comment.repository';
import { CreateMediaFileCommentDto } from './dto/create-media-file-comment.dto';
import { MediaFileComment } from './entities/media-file-comment.entity';
import { MediaFileCommentResponseDto } from './dto/response-media-file-comment.dto';

@Injectable()
export class MediaFileCommentService {
  constructor(private readonly commentRepo: MediaFileCommentRepository) {}

  async create(
    createDto: CreateMediaFileCommentDto,
  ): Promise<MediaFileCommentResponseDto> {
    const comment = await this.commentRepo.create(createDto);
    return this.toResponseDto(comment);
  }

  async findAllByMediaFile(
    mediaFileId: string,
  ): Promise<MediaFileCommentResponseDto[]> {
    const comments = await this.commentRepo.findAllByMediaFile(mediaFileId);
    return comments.map(this.toResponseDto);
  }

  async findOne(id: string): Promise<MediaFileCommentResponseDto | null> {
    const comment = await this.commentRepo.findOne(id);
    return comment ? this.toResponseDto(comment) : null;
  }

  toResponseDto(comment: MediaFileComment): MediaFileCommentResponseDto {
    return {
      ID: comment.dataValues.ID || "",
      MediaFileID: comment.dataValues.MediaFileID,
      UserEmail: comment.dataValues.UserEmail,
      UserName: comment.dataValues.UserName,
      CommentText: comment.dataValues.CommentText,
      CreatedAt: comment.createdAt,
      UpdatedAt: comment.updatedAt,
    };
  }
}
