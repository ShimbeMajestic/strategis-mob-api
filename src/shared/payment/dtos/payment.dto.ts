import * as moment from "moment";
import { OperatorEnum } from "../enum/operator.enum";

export class PaymentDto {
    amount: number;
    operator?: OperatorEnum;
    recipient: string;
    referenceID: string;
    billRef: string = '2265';
    transactionType: string = 'Debit';
    transactionDate: string = moment().format("YYYY-MM-DD HH:mm:ss");
}