import { IsInt, IsString, IsUUID } from 'class-validator';

export class CreateMediaFileDto {
  @IsInt()
  MediaTypeID?: number;

  @IsString()
  UploadedBy?: string;

  @IsString()
  UploadedByName: string;

  @IsUUID()
  EventID?: string;
}