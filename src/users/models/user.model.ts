import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Discount } from "../../discounts/models/discount.model";
import { Favorite } from "../../favorites/models/favorite.model";
import { Review } from "../../reviews/models/review.model";

interface IUsersCreationAttr {
  name: string;
  phone: string;
  email: string;
  hashed_password: string;
  location: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, IUsersCreationAttr> {
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
    type: DataType.STRING(15),
    unique: true,
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
  })
  declare hashed_password: string;

  @Column({
    type: DataType.STRING,
  })
  declare hashed_refresh_token: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_owner: boolean;

  @Column({
    type: DataType.STRING,
  })
  declare location: string;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare activation_link: string;

  @BelongsToMany(() => Discount, () => Favorite)
  favorite_discounts: Discount[];

  @BelongsToMany(()=>Discount, ()=>Review)
  review_discounts:Discount[]
}
