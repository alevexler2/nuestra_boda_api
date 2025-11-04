import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventSettings } from './entities/event-setting.entity';
import { EventSettingsRepository } from './event-settings.repository';
import { EventSettingsService } from './event-settings.service';
import { EventSettingsController } from './event-settings.controller';

@Module({
  imports: [SequelizeModule.forFeature([EventSettings])],
  providers: [EventSettingsRepository, EventSettingsService],
  controllers: [EventSettingsController],
  exports: [EventSettingsService],
})
export class EventSettingsModule {}
