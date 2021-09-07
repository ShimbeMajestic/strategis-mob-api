import { PaymentCallback } from "../../dtos/payment.callback";
import { PaymentDto } from "../../dtos/payment.dto";

export interface PaymentDriver {
    sendPush(paymentDto: PaymentDto): Promise<any>;
    callback(callbackDetails: PaymentCallback): Promise<boolean>;
}