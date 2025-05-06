import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { Discount } from "../../discounts/models/discount.model";

interface IFavoritesCreationAttr {
  userId: number;
  discountId: number;
}

@Table({ tableName: "favorites", timestamps: false })
export class Favorite extends Model<Favorite, IFavoritesCreationAttr> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => Discount)
  @Column({ type: DataType.INTEGER })
  discountId: number;
}
