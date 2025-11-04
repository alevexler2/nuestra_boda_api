import { IsUUID, IsNotEmpty } from 'class-validator';

export class GetMediaFileLikesDto {
  @IsUUID()
  @IsNotEmpty()
  MediaFileID: string;
}