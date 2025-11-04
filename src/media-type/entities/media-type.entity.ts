import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'MediaType' })
export class MediaType extends Model<MediaType> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare ID: number;

  @Column({
    type: DataType.STRING(250),
    allowNull: false,
  })
  declare Name: string;
}
