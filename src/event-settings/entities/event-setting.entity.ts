import { v4 as uuidv4 } from 'uuid';
import {
  Column,
  Model,
  Table,
  HasMany,
  Default,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { MediaFile } from 'src/media-file/entities/media-file.entity';
import { EventSettingsAttributes } from '../interface/event-setting.interface';

@Table({ tableName: 'EventSettings', timestamps: true })
export class EventSettings extends Model<
  EventSettingsAttributes,
  Omit<EventSettingsAttributes, 'ID'>
> {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-47a8-9b10-c11d12e13f14',
    description: 'ID único del evento (UUID)',
  })
  @Default(uuidv4)
  @Column({ primaryKey: true, type: DataType.UUID })
  ID: string;

  @ApiProperty({
    example: 'La boda de Juan y María',
    description: 'Nombre del evento',
  })
  @Column({ allowNull: false, type: DataType.STRING(250) })
  EventName: string;

  @ApiProperty({
    example: 'Nuestro Día Especial',
    description: 'Título del evento',
    required: false,
  })
  @Column({ allowNull: true, type: DataType.STRING(250) })
  title?: string;

  @ApiProperty({
    example: 'Una celebración especial',
    description: 'Subtítulo del evento',
    required: false,
  })
  @Column({ allowNull: true, type: DataType.STRING(250) })
  Subtitle?: string;

  @ApiProperty({
    example: '2025-06-15T00:00:00Z',
    description: 'Fecha del evento en formato ISO 8601',
  })
  @Column({ allowNull: false, type: DataType.DATE })
  EventDate: Date;

  @ApiProperty({
    example: {
      background: '#FF5733',
      backgroundSecondary: '#FFC300',
      font: '#000000',
      fontSecondary: '#333333',
    },
    description: 'Configuración de colores del tema',
    required: false,
  })
  @Column({ allowNull: true, type: DataType.JSON })
  Theme?: {
    background: string;
    backgroundSecondary: string;
    font: string;
    fontSecondary: string;
  };

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Email del propietario del evento',
  })
  @Column({ allowNull: false, type: DataType.STRING(250) })
  OwnerEmail1: string;

  @ApiProperty({
    example: 'maria@example.com',
    description: 'Email del segundo propietario',
    required: false,
  })
  @Column({ allowNull: true, type: DataType.STRING(250) })
  OwnerEmail2?: string;

  @ApiProperty({
    type: () => [MediaFile],
    description: 'Lista de archivos multimedia del evento',
  })
  @HasMany(() => MediaFile)
  mediaFiles: MediaFile[];
}
