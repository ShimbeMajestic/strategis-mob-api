import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/auth-user.decorator';
import { Customer } from 'src/modules/customer/models/customer.model';
import { AllowUserType } from 'src/modules/permission/decorators/user-type.decorator';
import { UserTypeEnum } from 'src/modules/permission/enums/user-type.enum';
import { UserTypeGuard } from 'src/modules/permission/guards/user-type.guard';
import { SetTravelPlanDto } from '../dtos/set-travel-plan.dto';
import { TravelPlan } from '../models/travel-plan.model';
import { TravelCoverService } from '../providers/travel-cover.service';

@Resolver()
export class TravelCoverResolver {
  constructor(private travelCoverService: TravelCoverService) {}

  @Query(() => [TravelPlan])
  @UseGuards(UserTypeGuard)
  @AllowUserType(UserTypeEnum.CUSTOMER)
  setTravelPlan(
    @Args('input') input: SetTravelPlanDto,
    @CurrentUser() customer: Customer,
  ) {
    return this.travelCoverService.setTravelPlan(input, customer);
  }
}
