import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { Customer } from 'src/modules/customer/models/customer.model';
import { AllowUserType } from 'src/modules/permission/decorators/user-type.decorator';
import { UserTypeEnum } from 'src/modules/permission/enums/user-type.enum';
import { UserTypeGuard } from 'src/modules/permission/guards/user-type.guard';
import { TransactionPaymentResultDto } from 'src/modules/transactions/dtos/transaction-payment.result.dto';
import { User } from 'src/modules/user/models/user.model';
import { ApprovalDto } from '../dtos/approval.dto';
import { ApprovalResult } from '../dtos/approval.result';
import { GetVehicleDetailsDto } from '../dtos/get-vehicle-details.response';
import { PayMotorCoverDto } from '../dtos/pay-motor-cover.dto';
import { SetMotorUsageTypeDto } from '../dtos/set-motor-usage-type.dto';
import {
    SetMotorCoverDurationDto,
    SetMotorCoverDurationInput,
} from '../dtos/set-motorcover-duration.dto';
import { SetMotorCoverType } from '../dtos/set-motorcover-type.dto';
import { SetVehicleValueDto } from '../dtos/set-vehicle-value.dto';
import { CreateVehicleDetailDto } from '../dtos/vehicle-detail.dto';
import { VehicleDetailRequestDto } from '../dtos/vehicle-detail.request';
import { MotorCoverRequest } from '../models/motor-cover-request.model';
import { MotorCovernoteService } from '../providers/motor-covernote.service';
import { MotorPolicy } from '../models/motor-policy.model';

@Resolver(() => MotorCoverRequest)
@UseGuards(GqlAuthGuard)
export class MotorCovernoteResolver {
    constructor(private motorCovernoteService: MotorCovernoteService) {}

    @Mutation(() => MotorCoverRequest)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    setMotorCoverAndDurationToRequest(
        @Args('input') input: SetMotorCoverDurationDto,
        @CurrentUser() customer: Customer,
    ): Promise<MotorCoverRequest> {
        return this.motorCovernoteService.setMotorCoverAndDuration(
            input,
            customer,
        );
    }

    @Mutation(() => MotorCoverRequest)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    setMotorCoverDuration(
        @Args('input') input: SetMotorCoverDurationInput,
    ): Promise<MotorCoverRequest> {
        return this.motorCovernoteService.setMotorCoverDuration(input);
    }

    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    @Query(() => GetVehicleDetailsDto)
    getVehicleDetails(
        @Args('input') request: VehicleDetailRequestDto,
    ): Promise<GetVehicleDetailsDto> {
        return this.motorCovernoteService.getVehicleDetails(request);
    }

    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    @Query(() => MotorCoverRequest)
    getTotalAmountToBePaid(
        @Args('requestId') requestId: number,
    ): Promise<MotorCoverRequest> {
        return this.motorCovernoteService.getTotalAmountToBePaid(requestId);
    }

    @Mutation(() => MotorCoverRequest)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    setMotorUsageType(
        @Args('input') input: SetMotorUsageTypeDto,
    ): Promise<MotorCoverRequest> {
        return this.motorCovernoteService.setMotorUsageType(input);
    }

    @Mutation(() => MotorCoverRequest)
    setMotorVehicleDetails(@Args('input') input: CreateVehicleDetailDto) {
        return this.motorCovernoteService.setMotorVehicleDetails(input);
    }

    @Mutation(() => TransactionPaymentResultDto)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    payForCover(
        @Args('input') input: PayMotorCoverDto,
        @CurrentUser() customer: Customer,
    ) {
        return this.motorCovernoteService.payForMotorCover(input, customer);
    }

    @Mutation(() => MotorCoverRequest)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    setMotorVehicleValue(@Args('input') input: SetVehicleValueDto) {
        return this.motorCovernoteService.setVehicleValue(input);
    }

    @Mutation(() => MotorCoverRequest)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    setMotorCoverType(@Args('input') input: SetMotorCoverType) {
        return this.motorCovernoteService.setMotorCoverType(input);
    }

    @Mutation(() => ApprovalResult)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.ADMIN)
    approveCoverRequest(
        @CurrentUser() user: User,
        @Args('input') input: ApprovalDto,
    ) {
        return this.motorCovernoteService.approveCoverRequest(user, input);
    }

    @Query(() => [MotorPolicy])
    @AllowUserType(UserTypeEnum.ADMIN)
    async allMotorPolicies(): Promise<MotorPolicy[]> {
        return await MotorPolicy.find({
            order: {
                id: 'DESC',
            },
        });
    }
}
