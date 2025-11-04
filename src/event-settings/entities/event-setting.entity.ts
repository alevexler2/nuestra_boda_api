import { v4 as uuidv4 } from 'uuid';
import {
  Column,
  Model,
  Table,
  HasMany,
  Default,
  DataType,
} from 'sequelize-typescript';
import { MediaFile } from 'src/media-file/entities/media-file.entity';
import { EventSettingsAttributes } from '../interface/event-setting.interface';

@Table({ tableName: 'EventSettings', timestamps: true })
export class EventSettings extends Model<
  EventSettingsAttributes,
  Omit<EventSettingsAttributes, 'ID'>
> {
  @Default(uuidv4)
  @Column({ primaryKey: true, type: DataType.UUID })
  ID: string;

  @Column({ allowNull: false, type: DataType.STRING(250) })
  EventName: string;

  @Column({ allowNull: true, type: DataType.STRING(250) })
  Subtitle?: string;

  @Column({ allowNull: false, type: DataType.DATE })
  EventDate: Date;

  @Column({ allowNull: false, type: DataType.STRING(250) })
  OwnerEmail1: string;

  @Column({ allowNull: true, type: DataType.STRING(250) })
  OwnerEmail2?: string;

  @HasMany(() => MediaFile)
  mediaFiles: MediaFile[];
}
