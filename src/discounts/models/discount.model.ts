import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import { Store } from "../../store/models/store.model";
import { Category } from "../../category/models/category.model";
import { Type } from "../../type/models/type.model";
import { User } from "../../users/models/user.model";
import { Favorite } from "../../favorites/models/favorite.model";
import { Review } from "../../reviews/models/review.model";

interface DiscountCreationAttrs {
  store_id: number;
  title: string;
  description?: string;
  discount_percent?: number;
  start_date: Date;
  end_date: Date;
  category_id: number;
  discount_value?: number;
  special_link?: string;
  is_active: boolean;
  type_id: number;
}

@Table({ tableName: "discounts" })
export class Discount extends Model<Discount, DiscountCreationAttrs> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Store)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare store_id: number;

  @BelongsTo(() => Store)
  store: Store;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  declare discount_percent: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare end_date: Date;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare category_id: number;

  @BelongsTo(() => Category)
  category: Category;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  declare discount_value: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare special_link: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare is_active: boolean;

  @ForeignKey(() => Type)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  declare type_id: number;

  @BelongsTo(() => Type)
  type: Type;

  @BelongsToMany(() => User, () => Favorite)
  favorite_users: User[];

  @BelongsToMany(() => User, () => Review)
  reviewing_users: User[];
}
