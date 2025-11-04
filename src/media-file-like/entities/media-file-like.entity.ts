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
import { MediaFile } from '../../media-file/entities/media-file.entity';

@Table({
  tableName: 'MediaFileLike',
  timestamps: true,
})
export class MediaFileLike extends Model<
  MediaFileLikeAttributes,
  Omit<MediaFileLikeAttributes, 'ID'>
> {
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  ID: string;

  @ForeignKey(() => MediaFile)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  MediaFileID: string;

  @BelongsTo(() => MediaFile)
  MediaFile: MediaFile;

  @Column({
    type: DataType.STRING(250),
    allowNull: false,
  })
  UserEmail: string;
}

export interface MediaFileLikeAttributes {
  ID?: string;
  MediaFileID: string;
  UserEmail: string;
}
