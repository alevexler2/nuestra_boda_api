import { Injectable } from '@nestjs/common';
import { EventSettingsRepository } from './event-settings.repository';
import { EventSettings } from './entities/event-setting.entity';
import { CreateEventSettingsDto } from './dto/create-event-setting.dto';

@Injectable()
export class EventSettingsService {
  constructor(private readonly repository: EventSettingsRepository) {}

  async create(createDto: CreateEventSettingsDto): Promise<EventSettings> {
    return this.repository.create(createDto);
  }

  async findOneById(id: string): Promise<EventSettings | null> {
    return this.repository.findOneById(id);
  }
}
