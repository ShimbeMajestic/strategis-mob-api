import { Args, Query, Resolver } from "@nestjs/graphql";
import { VehicleDetailResponse } from "../dtos/vehicle-detail.response";
import { VehicleDetailService } from "../providers/vehicle-detail.service";

@Resolver(() => VehicleDetailResponse)
export class VehicleDetailResolver {

    constructor(
        private vehicleDetailsService: VehicleDetailService
    ) { }

    @Query(() => VehicleDetailResponse)
    GetVehicleDetails(@Args('registrationNumber') regNo: string): Promise<VehicleDetailResponse> {
        return this.vehicleDetailsService.execute({
            registrationNumber: regNo
        })
    }
}