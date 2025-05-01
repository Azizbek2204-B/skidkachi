import {
  Controller,
  Post,
  Res,
  Req,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthAdminService } from './auth-admin.service';
import { SignInDto } from '../authUser/dto/sign-in.dto';

@Controller('auth-admin')
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authAdminService.signIn(signInDto, res);
  }

  @Post('signo-ut')
  async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authAdminService.signOut(req, res);
  }

  @Get('refresh-token')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authAdminService.refreshToken(req, res);
  }
}
