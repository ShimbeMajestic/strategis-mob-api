import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { NotificationService } from 'src/shared/notification/services/notification.service';
import {
  MOTOR_COVER_JOB,
  MOTOR_COVER_QUEUE,
  TRANSACTION_CALLBACK_JOB,
  TRANSACTION_CALLBACK_QUEUE,
} from 'src/shared/sms/constants';
import { CallbackDataDto } from '../dtos/callback-data.dto';
import { TransactionStatusEnum } from '../enums/transaction.enum';
import { Transaction } from '../models/transaction.model';

@Processor(TRANSACTION_CALLBACK_QUEUE)
export class TransactionConsumer {
  protected readonly logger = new Logger(TransactionConsumer.name);

  constructor(
    @InjectQueue(MOTOR_COVER_QUEUE)
    private readonly motorCoverQueue: Queue,
    private notificationService: NotificationService,
  ) {}

  @Process(TRANSACTION_CALLBACK_JOB)
  async processCallbackQueue(job: Job<CallbackDataDto>) {
    const data = Object.assign(new CallbackDataDto(), job.data);

    this.logger.log(
      `Processing Transaction callback job ID:${job.id}, ${JSON.stringify(
        data,
      )}`,
    );

    const { transid, result, reference, payment_status } = data;

    const transaction = await Transaction.findOne({
      where: { reference: transid },
      relations: [
        'customer',
        'motorCoverRequest',
        'motorCoverRequest.motorCover',
        'motorCoverRequest.vehicleDetails',
      ],
    });

    if (result === 'SUCCESS' && payment_status === 'COMPLETED') {
      transaction.status = TransactionStatusEnum.SUCCESS;
      transaction.operatorReferenceId = reference;

      await this.notificationService.sendNotificationToDevice({
        title: 'Payment Successful',
        body: `Successfully paid ${transaction.currency}.${transaction.amount} for Vehicle Registration No: ${transaction.motorCoverRequest.vehicleDetails.RegistrationNumber}. ${transaction.motorCoverRequest.motorCover.name} Motor Cover`,
        token: transaction.customer.token,
      });
    }

    if (result === 'FAIL') {
      transaction.status = TransactionStatusEnum.FAILED;
      transaction.operatorReferenceId = reference;

      await this.notificationService.sendNotificationToDevice({
        title: 'Payment Failed',
        body: `Payment Failed for Vehicle Registration No: ${transaction.motorCoverRequest.vehicleDetails.RegistrationNumber}. ${transaction.motorCoverRequest.motorCover.name} Motor Cover`,
        token: transaction.customer.token,
      });
    }

    await transaction.save();

    // Add cover request to queue

    await this.motorCoverQueue.add(MOTOR_COVER_JOB, transaction);
  }
}
