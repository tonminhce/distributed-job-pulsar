import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;
}
