import { Field, ObjectType } from '@nestjs/graphql';
import { VehicleDetail } from './vehicle-detail.response';

@ObjectType()
export class GetVehicleDetailsDto {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field({ nullable: true })
    activeCoverNote?: boolean;

    @Field({ nullable: true })
    data?: VehicleDetail;
}
