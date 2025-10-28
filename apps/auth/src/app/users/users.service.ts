import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-clients/auth';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcryptjs';

// private _serviceName: string = 'UsersService';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: {
        ...data,
        password: await hash(data.password, 10)
      }
    });
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }
}
