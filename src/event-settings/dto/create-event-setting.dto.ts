import { Type } from 'class-transformer';
import { IsString, IsDateString, IsEmail, IsOptional, IsHexColor, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ThemeDto {
  @ApiProperty({
    example: '#FF5733',
    description: 'Color hexadecimal para el fondo principal',
  })
  @IsHexColor()
  background: string;

  @ApiProperty({
    example: '#FFC300',
    description: 'Color hexadecimal para el fondo secundario',
  })
  @IsHexColor()
  backgroundSecondary: string;

  @ApiProperty({
    example: '#000000',
    description: 'Color hexadecimal para el texto principal',
  })
  @IsHexColor()
  font: string;

  @ApiProperty({
    example: '#333333',
    description: 'Color hexadecimal para el texto secundario',
  })
  @IsHexColor()
  fontSecondary: string;
}

export class CreateEventSettingsDto {
  @ApiProperty({
    example: 'La boda de Juan y María',
    description: 'Nombre del evento',
  })
  @IsString()
  EventName: string;

  @ApiProperty({
    example: 'Nuestro Día Especial',
    description: 'Título del evento (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Una celebración especial',
    description: 'Subtítulo del evento (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  Subtitle?: string;

  @ApiProperty({
    example: '2025-06-15',
    description: 'Fecha del evento en formato ISO 8601',
  })
  @IsDateString()
  EventDate: Date;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Email del propietario del evento',
  })
  @IsEmail()
  OwnerEmail1: string;

  @ApiProperty({
    example: 'maria@example.com',
    description: 'Email del segundo propietario (opcional)',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  OwnerEmail2?: string;

  @ApiProperty({
    type: ThemeDto,
    description: 'Configuración de colores del tema (opcional)',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThemeDto)
  Theme?: ThemeDto;
}
