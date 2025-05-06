import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discounts/models/discount.model";
import { User } from "../../users/models/user.model";

interface IReviewCreationAttr {
  discountId: number;
  userId: number;
  comment: string;
  rating: number;
}

@Table({tableName:"review"})
export class Review extends Model<Review, IReviewCreationAttr>{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(()=>Discount)
  @Column({
    type:DataType.INTEGER
  })
  declare discountId: number;

  @ForeignKey(()=>User)
  @Column({
    type:DataType.INTEGER
  })
  declare userId: number;

  @Column({
    type:DataType.STRING
  })
  declare comment: string;

  @Column({
    type:DataType.SMALLINT
  })
  declare rating: number;
}
