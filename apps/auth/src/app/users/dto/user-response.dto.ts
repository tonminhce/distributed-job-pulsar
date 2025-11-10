import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserResponseDto {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;
}
