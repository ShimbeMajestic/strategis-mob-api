import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/modules/auth/auth.guard";
import { AllowUserType } from "src/modules/permission/decorators/user-type.decorator";
import { UserTypeEnum } from "src/modules/permission/enums/user-type.enum";
import { UserTypeGuard } from "src/modules/permission/guards/user-type.guard";
import { VehicleDetailResponse } from "../dtos/vehicle-detail.response";
import { VehicleDetailService } from "../providers/vehicle-detail.service";

@UseGuards(GqlAuthGuard)
@Resolver(() => VehicleDetailResponse)
export class VehicleDetailResolver {

    constructor(
        private vehicleDetailsService: VehicleDetailService
    ) { }

    @UseGuards(UserTypeGuard)
    // @AllowUserType(UserTypeEnum.CUSTOMER)
    @Query(() => VehicleDetailResponse)
    GetVehicleDetails(@Args('registrationNumber') regNo: string): Promise<VehicleDetailResponse> {
        return this.vehicleDetailsService.execute({
            registrationNumber: regNo
        })
    }
}