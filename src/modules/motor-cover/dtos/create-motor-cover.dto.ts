import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMotorCoverDto {
    @Field()
    name: string;

    @Field()
    description: string;
}
