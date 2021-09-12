import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateMotorCoverDurationDto {

    @Field()
    name: string;

    @Field()
    duration: number;
}