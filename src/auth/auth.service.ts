import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/models/user.model";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInDto } from "./dto/sign-in.dto";
import * as bcrypt from "bcrypt";
import { Response } from "express";

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
    return { message: "Foydalanuchi qo'shildi", userId: newUser.id };
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const user = await this.usersService.findUserByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException("Email yoki password noto'g'ri1");
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
}
