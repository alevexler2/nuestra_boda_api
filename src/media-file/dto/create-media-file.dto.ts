import { IsUUID, IsInt, IsString, IsUrl, Length } from 'class-validator';

export class CreateMediaFileDto {
  @IsUrl()
  @Length(1, 250)
  URL: string;

  @IsInt()
  MediaTypeID: number;

  @IsString()
  @Length(1, 250)
  UploadedBy: string;

  @IsUUID()
  EventID?: string;
}