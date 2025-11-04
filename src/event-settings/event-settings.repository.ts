import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventSettings } from './entities/event-setting.entity';
import { CreateEventSettingsDto } from './dto/create-event-setting.dto';
import { InferCreationAttributes } from 'sequelize';

@Injectable()
export class EventSettingsRepository {
  constructor(
    @InjectModel(EventSettings)
    private readonly model: typeof EventSettings,
  ) {}

  async create(createDto: CreateEventSettingsDto): Promise<EventSettings> {
    return this.model.create(
      createDto as InferCreationAttributes<EventSettings>,
    );
  }

  async findOneById(id: string): Promise<EventSettings | null> {
    return this.model.findByPk(id);
  }
}
