import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import logger from '../config/logger.config';
import { compare } from 'bcryptjs';
import { TokenPayload } from './interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { User as PrismaUser } from '@prisma-clients/auth';
import { LoginResponse } from './models/login.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    logger.info(`${AuthService.name} initialized`);
  }

  async login(
    { email, password }: LoginInput,
    res: Response
  ): Promise<LoginResponse> {
    logger.info(
      `${AuthService.name}.login - Attempting login for email: ${email}`
    );

    const expires = new Date();
    expires.setMilliseconds(
      expires.getTime() +
        parseInt(this.configService.getOrThrow('JWT_EXPIRATION'))
    );
    const user = await this.verifyUserCredentials(email, password);

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(tokenPayload);

    // set cookie de su dung trong apollo playground
    // neu muon su dung xin hay them nay trong phan setting cua apollo playground
    // "request.credentials": "same-origin"
    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: !!this.configService.get('SECURE_COOKIE'),
      expires,
    });

    logger.info(
      `${AuthService.name}.login - Login successful for email: ${email}`
    );

    return {
      user,
      accessToken,
    };
  }

  private async verifyUserCredentials(
    email: string,
    password: string
  ): Promise<PrismaUser> {
    logger.info(
      `${AuthService.name}.verifyUserCredentials - Verifying credentials for email: ${email}`
    );

    try {
      const user = await lastValueFrom(this.usersService.getUser({ email }));
      await this.validatePassword(password, user);
      return user;
    } catch (error) {
      logger.error(
        `${AuthService.name}.verifyUserCredentials - Error: ${error.message}`
      );
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async validatePassword(
    password: string,
    user: PrismaUser
  ): Promise<void> {
    const authenticated = await compare(password, user.password);

    if (!authenticated) {
      logger.warn(
        `${AuthService.name}.validatePassword - Invalid password for user: ${user.email}`
      );
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
