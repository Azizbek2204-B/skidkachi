import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAdminCreationAttr {
  full_name: string;
  username: string;
  email: string;
  hashed_password: string;
  heshed_refresh_token: string;
  is_creator: boolean;
  is_active: boolean;
}

@Table({tableName:"admin"})
export class Admin extends Model<Admin, IAdminCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type:DataType.STRING(50),
    allowNull:false
  })
  declare full_name: string;

  @Column({
    type:DataType.STRING(50),
    allowNull:false
  })
  declare username: string;

  @Column({
    type:DataType.STRING(50),
    allowNull:false
  })
  declare email: string;

  @Column({
    type:DataType.STRING,
    allowNull:false
  })
  declare hashed_password: string;

  @Column({
    type:DataType.STRING,
    allowNull:false
  })
  declare heshed_refresh_token: string;

  @Column({
    type:DataType.BOOLEAN,
    allowNull:false
  })
  declare is_creator: boolean;

  @Column({
    type:DataType.BOOLEAN,
    allowNull:false
  })
  declare is_active: boolean;
}
