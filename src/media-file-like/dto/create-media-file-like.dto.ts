import { IsUUID, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateMediaFileLikeDto {
  @IsUUID()
  @IsNotEmpty()
  MediaFileID: string;

  @IsEmail()
  @IsNotEmpty()
  UserEmail: string;
}
