import { IsUUID } from 'class-validator';

export class GetMediaFileByIdDto {
  @IsUUID()
  ID: string;
}