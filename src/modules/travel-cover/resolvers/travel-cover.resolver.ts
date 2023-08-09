import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { Customer } from 'src/modules/customer/models/customer.model';
import { AllowUserType } from 'src/modules/permission/decorators/user-type.decorator';
import { UserTypeEnum } from 'src/modules/permission/enums/user-type.enum';
import { UserTypeGuard } from 'src/modules/permission/guards/user-type.guard';
import { TransactionPaymentResultDto } from 'src/modules/transactions/dtos/transaction-payment.result.dto';
import { PayForTravelCoverDto } from '../dtos/pay-travel-cover.dto';
import { SetTravelPlanDto } from '../dtos/set-travel-plan.dto';
import { SetTripInformationDto } from '../dtos/set-trip-info.dto';
import { TravelCoverRequest } from '../models/travel-cover-request.model';
import { TravelCoverService } from '../providers/travel-cover.service';

@Resolver(() => TravelCoverRequest)
@UseGuards(GqlAuthGuard)
export class TravelCoverResolver {
    constructor(private travelCoverService: TravelCoverService) {}

    @Mutation(() => TravelCoverRequest)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    setTravelPlan(
        @Args('input') input: SetTravelPlanDto,
        @CurrentUser() customer: Customer,
    ) {
        return this.travelCoverService.setTravelPlan(input, customer);
    }

    @Mutation(() => TransactionPaymentResultDto)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    payForTravelCover(
        @Args('input') input: PayForTravelCoverDto,
        @CurrentUser() customer: Customer,
    ) {
        return this.travelCoverService.payForCover(input, customer);
    }

    @Mutation(() => TravelCoverRequest)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    setTravelTripInformation(
        @Args('input') input: SetTripInformationDto,
        @CurrentUser() customer: Customer,
    ) {
        return this.travelCoverService.setTravelTripInformation(
            input,
            customer,
        );
    }
}
