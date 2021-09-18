import { Field, InputType, OmitType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { VehicleDetail } from "./vehicle-detail.response";

@InputType()
export class CreateVehicleDetailDto extends OmitType(VehicleDetail, ['NumberOfAxles', 'AxleDistance', 'SittingCapacity'] as const) {

    @Field()
    @IsNotEmpty()
    requestId: number;
}