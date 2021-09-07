import { Injectable, Logger } from "@nestjs/common";
import { PaymentCallback } from "../../dtos/payment.callback";
import { PaymentDto } from "../../dtos/payment.dto";
import { PaymentDriver } from "./payment-driver.interface";

@Injectable()
export class LogPayment implements PaymentDriver {

    private readonly logger = new Logger('LogPayment');

    sendPush(paymentDto: PaymentDto): Promise<any> {
        this.logger.verbose(JSON.stringify(paymentDto));
        return null;
    }
    callback(callbackDetails: PaymentCallback): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}