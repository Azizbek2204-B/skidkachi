import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AdminService } from "../admin/admin.service";
import { JwtService } from "@nestjs/jwt";
import { Admin } from "../admin/models/admin.model";
import { SignInDto } from "../authUser/dto/sign-in.dto";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService
  ) {}

  async generateTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESh_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const admin = await this.adminService.findByEmail(signInDto.email);

    if (!admin) {
      throw new BadRequestException("Email yoki password noto'g'ri1");
    }
    if (!admin.is_active) {
      throw new BadRequestException("Avval emailni tasdiqlang");
    }

    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      admin.hashed_password
    );
    if (!isValidPassword) {
      throw new BadRequestException("Email yoki password noto'g'ri2");
    }
    const { accessToken, refreshToken } = await this.generateTokens(admin);
    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    admin.heshed_refresh_token = await bcrypt.hash(refreshToken, 7);
    await admin.save();
    return {
      message: "Tizimga xush kelibsiz",
      accessToken,
    };
  }

  async signOut(req: Request, res: Response) {
    const refresh_token = req.cookies["refresh_token"];
    if (!refresh_token) {
      throw new BadRequestException("Refresh token topilmadi");
    }

    let adminId: number;
    try {
      const payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      adminId = payload.id;
    } catch (error) {
      throw new UnauthorizedException("Token noto‘g‘ri yoki muddati tugagan");
    }
    const admin = await this.adminService.findOne(adminId);
    if (!admin) {
      throw new UnauthorizedException("Foydalanuvchi topilmadi");
    }

    await admin.save();
    res.clearCookie("refresh_token");
    return { message: "Logout successfully" };
  }

  async refreshToken(req: Request, res: Response) {
    const refresh_token = req.cookies["refresh_token"];
    if (!refresh_token) {
      throw new BadRequestException("Refresh token topilmadi");
    }
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException("Token noto‘g‘ri yoki muddati tugagan");
    }

    const admin = await this.adminService.findOne(payload.id);
    
    if (!admin || !admin.heshed_refresh_token) {
      throw new UnauthorizedException(
        "Foydalanuvchi topilmadi yoki token yo‘q"
      );
    }

    const isMatch = await bcrypt.compare(
      refresh_token,
      admin.heshed_refresh_token
    );
    if (!isMatch) {
      throw new UnauthorizedException("Token mos emas");
    }

    const tokens = await this.generateTokens(admin);
    admin.heshed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    await admin.save();

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: "Token yangilandi",
      accessToken: tokens.accessToken,
    };
  }
}
