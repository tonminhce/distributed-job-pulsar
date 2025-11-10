import { ObjectType, Field } from '@nestjs/graphql';
import { UserResponseDto } from '../../users/dto/user-response.dto';

@ObjectType()
export class LoginResponseDto {
  @Field(() => UserResponseDto)
  user: UserResponseDto;

  @Field()
  accessToken: string;
}
