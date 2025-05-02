import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";

interface StoreCreationAttrs {
  name: string;
  location: string;
  phone: string;
  owner_id: number;
  since: Date;
  region_id: number;
  district_id: number;
  address: string;
  status_id: number;
}

@Table({ tableName: "store" })
export class Store extends Model<Store, StoreCreationAttrs> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare location: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phone: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare owner_id: number;

  @BelongsTo(() => User)
  declare owner: User;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare since: Date;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  declare region_id: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  declare district_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  declare status_id: number;
}
