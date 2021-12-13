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

  @Post('callback')
  callback(@Body() data: CallbackDataDto) {
    return this.transactionService.callback(data);
  }
}
