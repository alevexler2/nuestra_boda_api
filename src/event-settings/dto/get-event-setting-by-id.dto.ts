import { IsUUID } from 'class-validator';

export class GetEventSettingsByIdDto {
  @IsUUID()
  ID: string;
}
