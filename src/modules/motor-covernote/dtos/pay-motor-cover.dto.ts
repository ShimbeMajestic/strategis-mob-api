import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PayMotorCoverDto {

    @Field()
    channel: string;

    @Field()
    requestId: number;
}