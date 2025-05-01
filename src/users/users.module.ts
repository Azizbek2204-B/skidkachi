import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./models/user.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { EmailModule } from "../mail/mail.module";

@Module({
  imports: [SequelizeModule.forFeature([User]), EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
