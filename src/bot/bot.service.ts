import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./model/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { BOT_NAME } from "../app.constants";
import { where } from "sequelize";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async start(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await this.botModel.create({
          user_id: user_id!,
          username: ctx.from?.username!,
          first_name: ctx.from?.first_name!,
          last_name: ctx.from?.last_name!,
          lang: ctx.from?.language_code!,
        });
        await ctx.replyWithHTML(
          `Iltimos, <b>Telefon raqamini yuborish</b> tugmasini bosing`,
          {
            ...Markup.keyboard([
              [Markup.button.contactRequest("Telefon raqamini yuborish")],
            ])
              .oneTime()
              .resize(),
          }
        );
      } else if (!user.status || !user.phone_number) {
        await ctx.replyWithHTML(
          `Iltimos, <b>Telefon raqamini yuborish</b> tugmasini bosing`,
          {
            ...Markup.keyboard([
              [Markup.button.contactRequest("Telefon raqamini yuborish")],
            ])
              .oneTime()
              .resize(),
          }
        );
      } else {
        await ctx.replyWithHTML(
          "Bu bot orqali Skidkachi dasturida sotuvchilar faollashtiriladi",
          { ...Markup.removeKeyboard() }
        );
      }
    } catch (error) {
      console.log(`error on start`, error);
    }
  }

  async onContact(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.replyWithHTML(`Iltimos, <b>Start</b> tugmasini bosing`, {
          ...Markup.keyboard([["/start"]])
            .oneTime()
            .resize(),
        });
      } else if (user.phone_number) {
        await this.bot.telegram.sendChatAction(user_id!, "typing");
        await ctx.replyWithHTML("Siz avval ro'yxatdan o'tgansiz", {
          ...Markup.removeKeyboard(),
        });
      } else if (
        "contact" in ctx.message! &&
        ctx.message.contact.user_id != user_id
      ) {
        await ctx.replyWithHTML(
          `Iltimos, <b>Iltimos o'zingizni raqamingizni yuboring</b>`,
          {
            ...Markup.keyboard([
              [Markup.button.contactRequest("Telefon raqamini yuborish")],
            ])
              .oneTime()
              .resize(),
          }
        );
      } else if ("contact" in ctx.message!) {
        user.phone_number = ctx.message.contact.phone_number;
        user.status = true;
        await user.save();
        await ctx.replyWithHTML(`Tabriklayman ro'yxatdan o'tdingiz`, {
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log(`error on Contact`, error);
    }
  }

  async onStop(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.replyWithHTML(`Iltimos, <b>Start</b> tugmasini bosing`, {
          ...Markup.keyboard([["/start"]])
            .oneTime()
            .resize(),
        });
      } else if (user.status) {
        user.status = false;
        user.phone_number = "";
        await user.save();
        await ctx.replyWithHTML(
          `Siz vaqtincha botdan chiqdingiz.Qayta faollashtirish uchun <b>/start</b> tugmasini bosing`,
          {
            ...Markup.keyboard([["/start"]])
              .oneTime()
              .resize(),
          }
        );
      }
    } catch (error) {
      console.log(`error on Contact`, error);
    }
  }

  async sendOtp(phone_number: string, OTP: string) {
    try {
      const user = await this.botModel.findOne({ where: { phone_number } });
      if (!user || !user.status) {
        return false;
      }
      await this.bot.telegram.sendMessage(user.user_id, `Verify code:${OTP}`);
      return true;
    } catch (error) {
      console.log(`error on sendOtp`, error);
    }
  }
}
