import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediaFileLike } from './entities/media-file-like.entity';
import { MediaFileLikeRepository } from './media-file-like.repository';
import { MediaFileLikeService } from './media-file-like.service';
import { MediaFileLikeController } from './media-file-like.controller';
import { MediaFile } from '../media-file/entities/media-file.entity';

@Module({
  imports: [SequelizeModule.forFeature([MediaFileLike, MediaFile])],
  providers: [MediaFileLikeRepository, MediaFileLikeService],
  controllers: [MediaFileLikeController],
  exports: [MediaFileLikeService],
})
export class MediaFileLikeModule {}
