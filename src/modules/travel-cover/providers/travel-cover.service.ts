import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Customer } from 'src/modules/customer/models/customer.model';
import { SetTravelPlanDto } from '../dtos/set-travel-plan.dto';
import { TravelCoverRequest } from '../models/travel-cover-request.model';

@Injectable()
export class TravelCoverService {
  constructor() {}

  async setTravelPlan(
    input: SetTravelPlanDto,
    customer: Customer,
  ): Promise<TravelCoverRequest> {
    const { planId } = input;

    try {
      const travelRequest = new TravelCoverRequest();

      travelRequest.customer = customer;
      travelRequest.planId = planId;

      return travelRequest.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async payForCover() {}
}
