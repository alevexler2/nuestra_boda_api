import { PartialType } from '@nestjs/mapped-types';
import { CreateEventSettingsDto } from './create-event-setting.dto';

export class UpdateEventSettingDto extends PartialType(CreateEventSettingsDto) {}
