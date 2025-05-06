import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/models/user.model";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInDto } from "./dto/sign-in.dto";
import * as bcrypt from "bcrypt";
import { Request, response, Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async generateTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner,
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

  async signUp(createUserDto: CreateUserDto) {
    const candidate = await this.usersService.findUserByEmail(
      createUserDto.email
    );

    if (candidate) {
      throw new ConflictException("Bunday emailli foydalanuvchi mavjud");
    }

    const newUser = await this.usersService.create(createUserDto);
    return { message: "Foydalanuchi qo'shildi", user_id: newUser.id };
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const user = await this.usersService.findUserByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException("Email yoki password noto'g'ri1");
    }
    if (!user.is_active) {
      throw new BadRequestException("Avval emailni tasdiqlang");
    }
    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.hashed_password
    );
    if (!isValidPassword) {
      throw new BadRequestException("Email yoki password noto'g'ri2");
    }
    const { accessToken, refreshToken } = await this.generateTokens(user);
    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    user.hashed_refresh_token = await bcrypt.hash(refreshToken, 7);
    await user.save();
    return {
      message: "Tizimga xush kelibsiz",
      accessToken,
    };
  }

  async signOut(refreshToken: string, res: Response) {
    let user_id: number;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      user_id = payload.id;
    } catch (error) {
      throw new UnauthorizedException("Token noto‘g‘ri yoki muddati tugagan");
    }

    const user = await this.usersService.findOne(user_id);
    if (!user) {
      throw new UnauthorizedException("Foydalanuvchi topilmadi");
    }

    user.hashed_refresh_token = "";
    await user.save();

    res.clearCookie("refresh_token");

    return { message: "Logout successfully" };
  }

  // async refreshToken(req: Request, res:Response) {
  //   const refresh_token = req.cookies["refresh_token"];
  //   if (!refresh_token) {
  //     throw new BadRequestException("Refresh token topilmadi");
  //   }
  //   let payload: any;
  //   try {
  //     payload = await this.jwtService.verifyAsync(refresh_token, {
  //       secret: process.env.REFRESH_TOKEN_KEY,
  //     });
  //   } catch (error) {
  //     throw new UnauthorizedException("Token noto‘g‘ri yoki muddati tugagan");
  //   }

  //   const user = await this.usersService.findOne(payload.id);

  //   if (!user || !user.hashed_refresh_token) {
  //     throw new UnauthorizedException(
  //       "Foydalanuvchi topilmadi yoki token yo‘q"
  //     );
  //   }

  //   const isMatch = await bcrypt.compare(
  //     refresh_token,
  //     user.hashed_refresh_token
  //   );
  //   if (!isMatch) {
  //     throw new UnauthorizedException("Token mos emas");
  //   }

  //   const tokens = await this.generateTokens(user);
  //   user.hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
  //   await user.save();

  //   res.cookie("refresh_token", tokens.refreshToken, {
  //     maxAge: Number(process.env.COOKIE_TIME),
  //     httpOnly: true,
  //   });

  //   return {
  //     message: "Token yangilandi",
  //     accessToken: tokens.accessToken,
  //   };
  // }

  async refreshToken(user_id: number, refresh_token: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refresh_token);
    console.log(user_id);
    console.log(decodedToken["id"]);

    if (user_id !== decodedToken["id"]) {
      throw new ForbiddenException("Ruxsat etilmagan");
    }

    const user = await this.usersService.findOne(user_id);
    if (!user || !user.hashed_refresh_token) {
      throw new NotFoundException("User not found");
    }
    const tokenMatch = await bcrypt.compare(
      refresh_token,
      user.hashed_refresh_token
    );
    if (!tokenMatch) {
      throw new ForbiddenException("Forbidden");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    const hashed_refresh_token = await bcrypt.hash(refreshToken, 7);
    await this.usersService.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    const response = {
      message: "User refreshed",
      user_id: user.id,
      access_token: accessToken,
    };
    return response;
  }
}
