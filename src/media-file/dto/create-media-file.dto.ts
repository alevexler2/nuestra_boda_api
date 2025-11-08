import { IsInt, IsString, IsUUID } from 'class-validator';

export class CreateMediaFileDto {
  @IsInt()
  MediaTypeID?: number;

  @IsString()
  UploadedBy?: string;

  @IsUUID()
  EventID?: string;
}