import { InjectQueue } from "@nestjs/bull";
import { Body, Controller, Logger, Post } from "@nestjs/common";
import { Queue } from "bull";
import { PAYMENT_JOB, PAYMENT_QUEUE } from "./constants";
import { PaymentCallback } from "./dtos/payment.callback";

@Controller('payment')
export class PaymentController {

    private logger = new Logger('PaymentController');

    constructor(
        @InjectQueue(PAYMENT_QUEUE)
        private readonly paymentQueue: Queue,
    ) { }

    // Handle callbacks from the payment driver in use
    @Post('callback')
    async fastHubCallback(@Body() data: PaymentCallback): Promise<any> {

        this.logger.verbose(JSON.stringify(data));

        // Add transaction to queue
        await this.paymentQueue.add(PAYMENT_JOB, data);

        return {
            code: 0,
            status: "ok",
            reference_id: data.reference
        }
    }
}