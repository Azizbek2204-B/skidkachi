import { Column, DataType, Model } from "sequelize-typescript";

interface IAdCreationAttr {
  title: string;
  description: string;
  start_date: Date;
  target_url: string;
  placement: string;
  status: string;
  view_count: number;
}

export class Ad extends Model<Ad, IAdCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
  })
  declare description: string;

  @Column({
    type: DataType.DATEONLY,
  })
  declare start_date: Date;

  declare target_url: string;

  @Column({
    type: DataType.STRING,
  })
  declare placement: string;

  @Column({
    type: DataType.STRING,
  })
  declare status: string;

  @Column({
    type: DataType.BIGINT,
  })
  declare view_count: number;
}
