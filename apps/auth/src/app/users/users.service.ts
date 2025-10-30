import { Injectable } from '@nestjs/common';
import { Prisma, User as PrismaUser } from '@prisma-clients/auth';
import { PrismaService } from '../prisma/prisma.service';
import { loggerUtil } from '../utils/log.util';
import { hash } from 'bcryptjs';
import { Observable, from } from 'rxjs';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {
    loggerUtil.log(`${UsersService.name} initialized`);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    loggerUtil.log(`${UsersService.name}.createUser - Called with:`, {
      ...data,
      password: '[HIDDEN]',
    });

    try {
      const hashedPassword = await this.hashPassword(data.password);
      const user = await this.saveUser(data, hashedPassword);

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

  async findAll(): Promise<User[]> {
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
    // use prisma user to get password so that the auth can compare passwords
    loggerUtil.log(
      `${UsersService.name}.getUser - Fetching user with args:`,
      args
    );

    return from(
      this.prismaService.user
        .findUnique({ where: args })
        .then((user) => {
          if (user) {
            loggerUtil.log(
              `${UsersService.name}.getUser - User found:`,
              user.id
            );
          } else {
            loggerUtil.warn(
              `${UsersService.name}.getUser - User not found with args:`,
              args
            );
          }
          return user;
        })
        .catch((error) => {
          loggerUtil.error(
            `${UsersService.name}.getUser - Failed:`,
            error.message
          );
          throw error;
        })
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const hashed = await hash(password, 10);
    loggerUtil.log(
      `${UsersService.name}.hashPassword - Password hashed successfully`
    );
    return hashed;
  }

  private async saveUser(
    data: Prisma.UserCreateInput,
    hashedPassword: string
  ): Promise<User> {
    return this.prismaService.user.create({
      data: { ...data, password: hashedPassword },
    });
  }
}
