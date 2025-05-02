import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import { Region } from "../../region/models/region.model";

interface IDistrictCreationAttr {
  name: string;
  region_id: number;
}

@Table({ tableName: "district" })
export class District extends Model<District, IDistrictCreationAttr> {
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

  @ForeignKey(() => Region)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare region_id: number;

  @BelongsTo(() => Region)
  declare region: Region;
}
