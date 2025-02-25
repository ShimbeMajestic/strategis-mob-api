import { Field, InputType } from '@nestjs/graphql';
import { GuardType } from '../models/guard-type.enum';

@InputType()
export class CreateRoleInput {
    @Field()
    name: string;

    @Field()
    guard?: GuardType;
}
