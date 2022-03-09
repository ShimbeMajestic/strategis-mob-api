import { Body, Controller, Post } from '@nestjs/common';
import { CallbackDataDto } from '../dtos/callback-data.dto';
import { InitiateSelcomTransactionDto } from '../dtos/initiate-selcom-transaction.dto';
import { TransactionService } from '../providers/transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('selcom-pay')
  attemptPayment(@Body() data: InitiateSelcomTransactionDto) {
    return this.transactionService.initiateSelcomTransaction(data);
  }

  @Post('motor/callback')
  motorCallback(@Body() data: CallbackDataDto) {
    console.log(data);
    return this.transactionService.motorTransactionCallback(data);
  }

  @Post('travel/callback')
  travelCallback(@Body() data: CallbackDataDto) {
    console.log(data);
    return this.transactionService.travelTransactionCallback(data);
  }

  @Post('callback')
  callback(@Body() data: CallbackDataDto) {
    return this.transactionService.travelTransactionCallback(data);
  }
}
