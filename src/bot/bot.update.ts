import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { Context, Markup } from "telegraf";

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    ctx.reply("Salom");
  }

  @On("photo")
  async onPhoto(@Ctx() ctx: Context) {
    if ("photo" in ctx.message!) {
      console.log(ctx.message.photo);
      await ctx.replyWithPhoto(
        String(ctx.message.photo[ctx.message.photo.length - 1].file_id)
      );
    }
  }

  @On("document")
  async onDocument(@Ctx() ctx: Context) {
    if ("document" in ctx.message!) {
      console.log(ctx.message.document);
      await ctx.replyWithDocument(String(ctx.message.document.file_id));
    }
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    if ("contact" in ctx.message!) {
      console.log(ctx.message.contact);
      await ctx.reply(String(ctx.message.contact.phone_number));
      await ctx.reply(String(ctx.message.contact.first_name));
      await ctx.reply(String(ctx.message.contact.last_name));
      await ctx.reply(String(ctx.message.contact.vcard));
      await ctx.reply(String(ctx.message.contact.user_id));
    }
  }

  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    if ("location" in ctx.message!) {
      console.log(ctx.message.location);
      await ctx.reply(String(ctx.message.location.latitude));
      await ctx.reply(String(ctx.message.location.longitude));
      await ctx.replyWithLocation(
        ctx.message.location.latitude,
        ctx.message.location.longitude
      );
    }
  }

  @On("video")
  async onVideo(@Ctx() ctx: Context) {
    if ("video" in ctx.message!) {
      console.log(ctx.message.video);
      await ctx.reply(String(ctx.message.video.file_size));
      await ctx.replyWithVideo(String(ctx.message.video.file_id));
    }
  }

  @On("voice")
  async onVoice(@Ctx() ctx: Context) {
    if ("voice" in ctx.message!) {
      console.log(ctx.message.voice);
      await ctx.replyWithVoice(ctx.message.voice.file_id);
    }
  }

  @On("sticker")
  async onSticker(@Ctx() ctx: Context) {
    if ("sticker" in ctx.message!) {
      console.log(ctx.message.sticker);
      await ctx.replyWithVideo(String(ctx.message.sticker.file_id));
    }
  }

  @On("animation")
  async onAnimation(@Ctx() ctx: Context) {
    if ("animation" in ctx.message!) {
      console.log(ctx.message.animation);
      await ctx.replyWithAnimation(String(ctx.message.animation.file_id));
    }
  }

  @Command("help")
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply(
      "Yordam kerakmi? Quyidagilarni sinab ko'ring:\n/start - Boshlash\n/help - Yordam\n/about - Haqida"
    );
  }

  @Command("about")
  async onAbout(@Ctx() ctx: Context) {
    await ctx.reply("Bu bot chegirmalar haqida ma'lumot beradi.");
  }

  @Command("inline")
  async onCommandInline(@Ctx() ctx: Context) {
    const inlineKeyboard = [
      [
        {
          text: "Button 1",
          callback_data: "button_1",
        },
        {
          text: "Button 2",
          callback_data: "button_2",
        },
        {
          text: "Button 3",
          callback_data: "button_3",
        },
      ],
      [
        {
          text: "Button 4",
          callback_data: "button_4",
        },
        {
          text: "Button 5",
          callback_data: "button_5",
        },
        {
          text: "Button 6",
          callback_data: "button_6",
        },
      ],
    ];
    await ctx.reply("Kerakli tugmani tanlang:", {
      reply_markup: { inline_keyboard: inlineKeyboard },
    });
  }

  @Action("button_1")
  async onAction(@Ctx() ctx: Context) {
    await ctx.reply("Burron1 bosildi");
  }

  @Action("button_2")
  async onAction1(@Ctx() ctx: Context) {
    await ctx.reply("Burron2 bosildi");
  }

  @Action("button_3")
  async onAction2(@Ctx() ctx: Context) {
    await ctx.reply("Burron3 bosildi");
  }

  @Action(/^button_+\d+$/)
  async onActionAntButton(@Ctx() ctx: Context) {
    // const buttonData = ctx.callbackQuery?.
    if ("data" in ctx.callbackQuery!) {
      const buttonData = ctx.callbackQuery.data.split("_")[1];
      await ctx.reply(`${buttonData} Button bosildi`);
    }
    await ctx.reply("Any Burron bosildi");
  }

  @Command("main")
  async onCommandMain(@Ctx() ctx: Context) {
    const mainKeyboard = [["bir", "ikki", "uch"], ["tort", "besh"], ["olti"]];
    await ctx.reply("Kerakli main tugmani tanlang:", {
      ...Markup.keyboard(mainKeyboard).resize(),
    });
  }

  @Hears("hi")
  async onHearsHi(@Ctx() ctx: Context) {
    await ctx.reply("Hello");
  }

  @On("text")
  async onText(@Ctx() ctx: Context) {
    console.log(ctx);
    if ("text" in ctx.message!) {
      if (ctx.message.text == "hil") {
        await ctx.replyWithHTML("<b>Hello</b>");
      } else {
        await ctx.replyWithHTML(ctx.message.text);
      }
    }
  }
  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    console.log(ctx.botInfo);
    console.log(ctx.chat);
    console.log(ctx.chat!.id);
    console.log(ctx.from);
    console.log(ctx.from!.id);
  }
}
