// abstract graphql model so that all entities can extend it
import { ID, ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class AbstractModel {
  @Field(() => ID)
  id: string;
}
