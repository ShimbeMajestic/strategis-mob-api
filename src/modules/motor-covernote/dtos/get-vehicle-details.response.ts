import { Field, ObjectType } from "@nestjs/graphql";
import { VehicleDetailDto } from "./vehicle-detail.response";

@ObjectType()
export class GetVehicleDetailsDto {

    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field({ nullable: true })
    data?: VehicleDetailDto;
}