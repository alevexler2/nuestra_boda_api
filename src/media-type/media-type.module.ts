import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MediaTypeService } from './media-type.service';
import { MediaTypeController } from './media-type.controller';
import { MediaType } from './entities/media-type.entity';
import { MediaTypeRepository } from './media-type.repository';

@Module({
  imports: [SequelizeModule.forFeature([MediaType])],
  controllers: [MediaTypeController],
  providers: [MediaTypeService, MediaTypeRepository],
  exports: [MediaTypeService],
})
export class MediaTypeModule {}
