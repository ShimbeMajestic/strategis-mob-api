import { Inject, Injectable, Logger } from "@nestjs/common";
import { PAYMENT_DRIVER } from "../constants";
import { PaymentDto } from "../dtos/payment.dto";
import { PaymentDriver } from "./drivers/payment-driver.interface";

@Injectable()
export class PaymentService {
    protected readonly logger = new Logger(PaymentService.name);

    constructor(
        @Inject(PAYMENT_DRIVER)
        protected readonly paymentDriver: PaymentDriver
    ) { }

    async pay(paymentDto: PaymentDto): Promise<any> {

        this.logger.verbose(`Attempting to pay ${JSON.stringify(paymentDto)}`);
        const result = await this.paymentDriver.sendPush(paymentDto);
        // log payment request response 
        this.logger.verbose(`Payment result ${JSON.stringify(result)}`);

        return result;
    }
}