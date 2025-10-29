import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-clients/auth';
import { PrismaService } from '../prisma/prisma.service';
import { loggerUtil } from '../utils/log.util';
import { hash } from 'bcryptjs';

const _serviceName = 'AuthService';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {
    loggerUtil.log(`${_serviceName} initialized`);
  }

  async createUser(data: Prisma.UserCreateInput) {
    loggerUtil.log('createUser called with:', {
      ...data,
      password: '[HIDDEN]',
    });

    try {
      const hashed = await hash(data.password, 10);
      loggerUtil.log('Password hashed successfully');

      return await this.prismaService.user.create({
        data: { ...data, password: hashed },
      });
    } catch (error) {
      loggerUtil.error('createUser failed:', error.message);
      throw error;
    }
  }

  async findAll() {
    loggerUtil.log(`${_serviceName}.findAll - Fetching all users`);
    return this.prismaService.user.findMany();
  }
}
