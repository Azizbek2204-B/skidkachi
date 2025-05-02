import { Body, Controller, HttpCode, Param, ParseIntPipe, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { Request, Response } from "express";
import { ServerStreamFileResponseOptionsWithError } from "node:http2";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post("sign-in")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @HttpCode(200)
  @Post("sign-out")
  async signOut(
    @CookieGetter("refresh_token") refreshToken:string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(refreshToken, res);
  }

  @Post(":id/refresh-token")
  async refreshToken(
    @Param("id", ParseIntPipe) id:number,
    @CookieGetter("refresh_token") refreshToken:string,
    @Res({ passthrough: true }) res: Response
  ){
    return this.authService.refreshToken(id, refreshToken, res)
  }
}
