import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from 'src/modules/customer/models/customer.model';
import { TransactionPaymentResultDto } from 'src/modules/transactions/dtos/transaction-payment.result.dto';
import { TransactionService } from 'src/modules/transactions/providers/transaction.service';
import { PayForTravelCoverDto } from '../dtos/pay-travel-cover.dto';
import { SetTravelPlanDto } from '../dtos/set-travel-plan.dto';
import { TravelCoverRequest } from '../models/travel-cover-request.model';

@Injectable()
export class TravelCoverService {
  constructor(private transactionService: TransactionService) {}

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

  async payForCover(
    input: PayForTravelCoverDto,
    customer: Customer,
  ): Promise<TransactionPaymentResultDto> {
    const { email, travelCoverRequestId } = input;

    const travelRequest = await TravelCoverRequest.findOne({
      where: { id: travelCoverRequestId },
      relations: ['plan'],
    });

    if (!travelRequest) {
      throw new NotFoundException('Travel cover request not found!');
    }

    return this.transactionService.payForTravelCover(
      travelCoverRequestId,
      travelRequest.plan,
      customer,
      email,
    );
  }
}
