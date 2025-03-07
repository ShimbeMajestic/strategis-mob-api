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
import { SetTripInformationDto } from '../dtos/set-trip-info.dto';
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
            relations: ['plan', 'plan.destination'],
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

    async setTravelTripInformation(input: SetTripInformationDto) {
        const {
            departureDate,
            returnDate,
            passportNo,
            email,
            name,
            gender,
            dateOfBirth,
        } = input;
        const travelRequest = await TravelCoverRequest.findOne({
            where: {
                id: input.requestId,
            },
            relations: ['plan', 'plan.destination'],
        });

        if (!travelRequest) {
            throw new NotFoundException('Travel cover request not found!');
        }

        const years = await this.calculateYears(dateOfBirth);
        const months = await this.calculateMonths(dateOfBirth);

        let amountAfterDiscount;

        if (years < 18) {
            // people between 3 months and 18 years discount of 50%
            amountAfterDiscount = travelRequest.plan.price * 0.5;
        } else if (years > 65 && years < 76) {
            // people between 66 years and 77 years, increase of 50%
            amountAfterDiscount = travelRequest.plan.price * 1.5;
        } else if (years > 75 && years < 81) {
            // people between 76 years and 80 years, increase of 100%
            amountAfterDiscount = travelRequest.plan.price * 2;
        } else if (
            travelRequest.plan.destination.name == 'Europe' &&
            years > 80
        ) {
            // people over 80 years in europe, increase of 300%
            amountAfterDiscount = travelRequest.plan.price * 4;
        } else {
            amountAfterDiscount = travelRequest.plan.price;
        }

        travelRequest.amountAfterDiscount = amountAfterDiscount;
        travelRequest.departureDate = departureDate;
        travelRequest.returnDate = returnDate;
        travelRequest.passportNo = passportNo;
        travelRequest.email = email;
        travelRequest.name = name;
        travelRequest.gender = gender;
        travelRequest.dateOfBirth = dateOfBirth;

        return travelRequest.save();
    }

    private calculateYears(dob: Date) {
        const today = new Date();

        const dateOfBirth = new Date(dob);

        const date = today.getFullYear() - dateOfBirth.getFullYear();

        return date;
    }

    private calculateMonths(dob: Date) {
        const today = new Date();

        const dateOfBirth = new Date(dob);

        const months = today.getMonth() - dateOfBirth.getMonth();

        return months;
    }
}
