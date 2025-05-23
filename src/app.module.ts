import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { User } from "./users/models/user.model";
import { AuthModule } from "./authUser/auth.module";
import { EmailModule } from "./mail/mail.module";
import { AdminModule } from "./admin/admin.module";
import { AuthAdminModule } from "./auth-admin/auth-admin.module";
import { StatusModule } from "./status/status.module";
import { DistrictModule } from "./district/district.module";
import { RegionModule } from "./region/region.module";
import { StoreModule } from "./store/store.module";
import { Store } from "./store/models/store.model";
import { BotModule } from "./bot/bot.module";
import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constants";
import { SocialMediaTypeModule } from "./social_media_type/social_media_type.module";
import { StoreSocialLinksModule } from "./store_social_links/store_social_links.module";
import { TypeModule } from "./type/type.module";
import { CategoryModule } from "./category/category.module";
import { DiscountsModule } from "./discounts/discounts.module";
import { Bot } from "./bot/model/bot.model";
import { AdsModule } from "./ads/ads.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { StoreSubscribesModule } from "./store_subscribes/store_subscribes.module";
import { Favorite } from "./favorites/models/favorite.model";
import { MediaModule } from "./media/media.module";
import { Review } from "./reviews/models/review.model";
import { Discount } from "./discounts/models/discount.model";
import { Category } from "./category/models/category.model";
import { Type } from "./type/models/type.model";
import { Ad } from "./ads/models/ad.model";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN!,
        middlewares: [],
        include: [BotModule],
      }),
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [User, Store, Bot, Favorite, Review, Discount, Category, Type, Ad],
      autoLoadModels: true,
      sync: { force: true },
      logging: false,
    }),
    UsersModule,
    AuthModule,
    EmailModule,
    AdminModule,
    AuthAdminModule,
    StoreModule,
    RegionModule,
    DistrictModule,
    StatusModule,
    BotModule,
    SocialMediaTypeModule,
    StoreSocialLinksModule,
    TypeModule,
    CategoryModule,
    DiscountsModule,
    AdsModule,
    ReviewsModule,
    FavoritesModule,
    StoreSubscribesModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
