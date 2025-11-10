import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserResponse } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../auth/guards/graphql-auth.guard';

@Resolver(() => UserResponse)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => UserResponse)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<UserResponse> {
    return this.usersService.createUser(createUserInput);
  }

  @UseGuards(GraphQLAuthGuard)
  @Query(() => [UserResponse], { name: 'users' })
  async findAll(): Promise<UserResponse[]> {
    return this.usersService.findAll();
  }
}
