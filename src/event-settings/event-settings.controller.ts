import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EventSettingsService } from './event-settings.service';
import { CreateEventSettingsDto } from './dto/create-event-setting.dto';
import { EventSettings } from './entities/event-setting.entity';

@Controller('event-settings')
export class EventSettingsController {
  constructor(private readonly service: EventSettingsService) {}

  @Post()
  async create(
    @Body() createDto: CreateEventSettingsDto,
  ): Promise<EventSettings> {
    return this.service.create(createDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<EventSettings | null> {
    return this.service.findOneById(id);
  }
}
