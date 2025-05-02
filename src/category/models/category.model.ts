import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

interface ICategoryCreationAttr {
  name: string;
  description: string;
  parent_id: number;
}

@Table({tableName:"category"})
export class Category extends Model<Category, ICategoryCreationAttr> {
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

  @ForeignKey(() => Category)
  @Column({
    type: DataType.BIGINT,
  })
  parent_id: number;

  @BelongsTo(()=>Category, 'parent_id')
  parent:Category

  @HasMany(()=>Category, 'parent_id')
  children:Category[]
}
