import {AbstractModel} from '@distributed-job/nestjs';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User extends AbstractModel {
    @Field()
    email: string;

    @Field()
    name: string;
}