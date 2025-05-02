import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { SocialMediaType } from "../../social_media_type/models/social_media_type.model";
import { Store } from "../../store/models/store.model";

interface IStoreSocialLinkCreationAttr {
  url: string;
  description?: string;
  store_id: number;
  social_media_type_id: number;
}

@Table({ tableName: "store_social_links" })
export class StoreSocialLink extends Model<
  StoreSocialLink,
  IStoreSocialLinkCreationAttr
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description: string;

  @ForeignKey(() => Store)
  @Column({ type: DataType.BIGINT })
  declare store_id: number;

  @BelongsTo(() => Store)
  store: Store;

  @ForeignKey(() => SocialMediaType)
  @Column({ type: DataType.BIGINT })
  declare social_media_type_id: number;

  @BelongsTo(() => SocialMediaType)
  socialMediaType: SocialMediaType;
}
