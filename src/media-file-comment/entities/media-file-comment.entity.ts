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
  tableName: 'MediaFileComment',
  timestamps: true,
})
export class MediaFileComment extends Model<
  MediaFileCommentAttributes,
  Omit<MediaFileCommentAttributes, 'ID'>
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

  @Column({
    type: DataType.STRING(250),
    allowNull: false,
  })
  UserName: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  CommentText: string;
}

export interface MediaFileCommentAttributes {
  ID?: string;
  MediaFileID: string;
  UserEmail: string;
  UserName: string;
  CommentText: string;
}
