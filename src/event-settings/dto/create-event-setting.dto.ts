import { IsString, IsDateString, IsEmail, IsOptional } from 'class-validator';

export class CreateEventSettingsDto {
  @IsString()
  EventName: string;

  @IsString()
  @IsOptional()
  Subtitle?: string;

  @IsDateString()
  EventDate: Date;

  @IsEmail()
  OwnerEmail1: string;

  @IsEmail()
  @IsOptional()
  OwnerEmail2?: string;
}
