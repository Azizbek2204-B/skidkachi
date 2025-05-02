import { Column, DataType, Model } from "sequelize-typescript";

interface IStatusCreationAttr {
  name: string;
  description: string;
}

export class Status extends Model<Status, IStatusCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare description: string;
}
