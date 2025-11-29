import { Type } from 'class-transformer';
import { IsString, IsDateString, IsEmail, IsOptional, IsHexColor, ValidateNested } from 'class-validator';

export class ThemeDto {
  @IsHexColor()
  background: string;

  @IsHexColor()
  backgroundSecondary: string;

  @IsHexColor()
  font: string;

  @IsHexColor()
  fontSecondary: string;
}

export class CreateEventSettingsDto {
  @IsString()
  EventName: string;

  @IsString()
  @IsOptional()
  title?: string;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => ThemeDto)
  Theme?: ThemeDto;
}
