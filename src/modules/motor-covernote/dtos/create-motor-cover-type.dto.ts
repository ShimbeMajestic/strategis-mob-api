import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateMotorCoverTypeDto {

    @Field()
    productCode: string;

    @Field()
    productName: string;

    @Field()
    riskName: string;

    @Field()
    riskCode: string;

    @Field()
    rate: number;

    @Field()
    minimumAmount: number

}