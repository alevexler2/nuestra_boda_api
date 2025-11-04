import { IsUUID, IsNotEmpty } from 'class-validator';

export class GetMediaFileCommentsDto {
  @IsUUID()
  @IsNotEmpty()
  MediaFileID: string;
}
