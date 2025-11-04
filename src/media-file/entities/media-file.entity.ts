import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { MediaType } from '../../media-type/entities/media-type.entity';
import { EventSettings } from '../../event-settings/entities/event-setting.entity';
import { MediaFileAttributes } from '../interface/media-file-interface';

@Table({
  tableName: 'MediaFile',
  timestamps: true,
})
export class MediaFile extends Model<
  MediaFileAttributes,
  Omit<MediaFileAttributes, 'ID'>
> {
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  ID: string;

  @Column({
    type: DataType.STRING(250),
    allowNull: false,
  })
  URL: string;

  @ForeignKey(() => MediaType)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  MediaTypeID: number;

  @BelongsTo(() => MediaType)
  MediaType: MediaType;

  @Column({
    type: DataType.STRING(250),
    allowNull: false,
  })
  UploadedBy: string;

  @ForeignKey(() => EventSettings)
  @Column({ type: DataType.UUID, allowNull: true })
  EventID: string;

  @BelongsTo(() => EventSettings)
  event: EventSettings;
}
