import { Module } from '@nestjs/common';
import { MediaFileService } from './media-file.service';
import { MediaFileController } from './media-file.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediaFile } from './entities/media-file.entity';
import { MediaFileRepository } from './media-file.repository';

@Module({
  imports: [SequelizeModule.forFeature([MediaFile])],
  providers: [MediaFileService, MediaFileRepository],
  controllers: [MediaFileController],
  exports: [MediaFileService], 
})
export class MediaFileModule {}
