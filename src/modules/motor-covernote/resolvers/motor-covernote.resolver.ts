import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { CurrentUser } from "src/modules/auth/auth-user.decorator";
import { GqlAuthGuard } from "src/modules/auth/auth.guard";
import { Customer } from "src/modules/customer/models/customer.model";
import { AllowUserType } from "src/modules/permission/decorators/user-type.decorator";
import { UserTypeEnum } from "src/modules/permission/enums/user-type.enum";
import { UserTypeGuard } from "src/modules/permission/guards/user-type.guard";
import { GetVehicleDetailsDto } from "../dtos/get-vehicle-details.response";
import { SetMotorCoverDurationDto } from "../dtos/set-motorcover-duration.dto";
import { VehicleDetailRequestDto } from "../dtos/vehicle-detail.request";
import { MotorCoverRequest } from "../models/mover-cover-req.model";
import { MotorCovernoteService } from "../providers/motor-covernote.service";

@Resolver(() => MotorCoverRequest)
@UseGuards(GqlAuthGuard)
export class MotorCovernoteResolver {

    constructor(
        private motorCovernoteService: MotorCovernoteService
    ) { }

    @Mutation(() => MotorCoverRequest)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    setMotorCoverAndDurationToRequest(@Args('input') input: SetMotorCoverDurationDto, @CurrentUser() customer: Customer): Promise<MotorCoverRequest> {
        return this.motorCovernoteService.setMotorCoverAndDuration(input, customer);
    }

    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    @Query(() => GetVehicleDetailsDto)
    getVehicleDetails(@Args('input') request: VehicleDetailRequestDto): Promise<GetVehicleDetailsDto> {
        return this.motorCovernoteService.getVehicleDetails(request)
    }

    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    @Query(() => MotorCoverRequest)
    getTotalAmountToBePaid(@Args('requiestId') requestId: number): Promise<MotorCoverRequest> {
        return this.motorCovernoteService.getTotalAmountToBePaid(requestId);
    }


}