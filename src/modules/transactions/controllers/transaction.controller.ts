import { Body, Controller, Post } from '@nestjs/common';
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
  callback(@Body() data: any) {
    this.transactionService.callback(data);
  }
}
