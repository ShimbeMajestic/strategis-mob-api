import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PayMotorCoverDto {
    @Field()
    email: string;

    @Field()
    requestId: number;
}
