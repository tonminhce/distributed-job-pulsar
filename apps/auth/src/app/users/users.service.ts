import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User as PrismaUser } from '@prisma-clients/auth';
import { PrismaService } from '../prisma/prisma.service';
import { loggerUtil } from '../utils/log.util';
import { hash } from 'bcryptjs';
import { Observable, from } from 'rxjs';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {
    loggerUtil.log(`${UsersService.name} initialized`);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserResponseDto> {
    loggerUtil.log(`${UsersService.name}.createUser - Called with:`, {
      ...data,
      password: '[HIDDEN]',
    });

    try {
      const hashedPassword = await hash(data.password, 10);
      const user = await this.prismaService.user.create({
        data: { ...data, password: hashedPassword },
      });

      loggerUtil.log(
        `${UsersService.name}.createUser - User created successfully:`,
        user.id
      );
      return user;
    } catch (error) {
      loggerUtil.error(
        `${UsersService.name}.createUser - Failed:`,
        error.message
      );
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    loggerUtil.log(`${UsersService.name}.findAll - Fetching all users`);

    try {
      const users = await this.prismaService.user.findMany();
      loggerUtil.log(
        `${UsersService.name}.findAll - Found ${users.length} users`
      );
      return users;
    } catch (error) {
      loggerUtil.error(`${UsersService.name}.findAll - Failed:`, error.message);
      throw error;
    }
  }

  getUser(args: Prisma.UserWhereUniqueInput): Observable<PrismaUser> {
    loggerUtil.log(
      `${UsersService.name}.getUser - Fetching user with args:`,
      args
    );

    return from(
      this.prismaService.user
        .findUnique({ where: args })
        .then((user) => {
          if (!user) {
            throw new NotFoundException(`User not found with args: ${JSON.stringify(args)}`);
          }
          return user;
        })
    );
  }
}
