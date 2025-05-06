import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./models/user.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { EmailModule } from "../mail/mail.module";
import { BotModule } from "../bot/bot.module";

@Module({
  imports: [SequelizeModule.forFeature([User]), EmailModule, BotModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
