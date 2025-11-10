import { ObjectType, Field } from '@nestjs/graphql';
import { UserResponse } from '../../users/models/user.model';

@ObjectType()
export class LoginResponse {
  @Field(() => UserResponse)
  user: UserResponse;

  @Field()
  accessToken: string;
}
