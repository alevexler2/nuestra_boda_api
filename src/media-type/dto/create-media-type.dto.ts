import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMediaTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  Name: string;
}