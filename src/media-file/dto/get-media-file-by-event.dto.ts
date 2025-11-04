import { IsUUID } from 'class-validator';

export class GetMediaFilesByEventDto {
  @IsUUID()
  EventID: string;
}