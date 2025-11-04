import {
  IsUUID,
  IsNotEmpty,
  IsEmail,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMediaFileCommentDto {
  @IsUUID()
  @IsNotEmpty()
  MediaFileID: string;

  @IsEmail()
  @IsNotEmpty()
  UserEmail: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  CommentText: string;
}
