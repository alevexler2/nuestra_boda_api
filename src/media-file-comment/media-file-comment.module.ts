import { Module } from '@nestjs/common';
import { MediaFileCommentService } from './media-file-comment.service';
import { MediaFileCommentController } from './media-file-comment.controller';
import { MediaFileComment } from './entities/media-file-comment.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediaFileCommentRepository } from './media-file-comment.repository';

@Module({
  imports: [SequelizeModule.forFeature([MediaFileComment])],
  controllers: [MediaFileCommentController],
  providers: [MediaFileCommentRepository, MediaFileCommentService],
  exports: [MediaFileCommentService],
})
export class MediaFileCommentModule {}
