import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { MediaType } from '../../media-type/entities/media-type.entity';
import { EventSettings } from '../../event-settings/entities/event-setting.entity';
import { MediaFileAttributes } from '../interface/media-file-interface';
import { MediaFileComment } from '@/media-file-comment/entities/media-file-comment.entity';
import { MediaFileLike } from '@/media-file-like/entities/media-file-like.entity';

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

  @HasMany(() => MediaFileComment, {
    foreignKey: 'MediaFileID',
    onDelete: 'CASCADE',
    hooks: true,
  })
  comments: MediaFileComment[];

  @HasMany(() => MediaFileLike, {
    foreignKey: 'MediaFileID',
    onDelete: 'CASCADE',
    hooks: true,
  })
  likes: MediaFileLike[];
}
