import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/models/user.model';
import { AuthModule } from './authUser/auth.module';
import { EmailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { AuthAdminModule } from './auth-admin/auth-admin.module';
import { StatusModule } from './status/status.module';
import { DistrictModule } from './district/district.module';
import { RegionModule } from './region/region.module';
import { StoreModule } from './store/store.module';
import { Store } from './store/models/store.model';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [User, Store],
      autoLoadModels: true,
      sync: {alter: true },
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
