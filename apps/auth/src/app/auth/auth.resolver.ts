import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LoginInput } from './dto/login.input';
import { AuthService } from './auth.service';
import { LoginResponse } from './models/login.model';
import { GraphQLContext } from '@distributed-job/nestjs';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: GraphQLContext
  ): Promise<LoginResponse> {
    return this.authService.login(loginInput, context.res);
  }
}
