import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { MotorUsageType } from "../enums/motor-usage.enum";

@InputType()
export class SetMotorUsageTypeDto {

    @Field()
    @IsNotEmpty()
    requestId: number;

    @Field()
    @IsNotEmpty()
    usageType: MotorUsageType;
}