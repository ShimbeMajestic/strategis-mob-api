import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { createHmac, randomUUID } from 'crypto';
import * as moment from 'moment';
import { selcomConfig } from 'src/config/selcom.config';
import { Customer } from 'src/modules/customer/models/customer.model';
import { MotorCoverRequest } from 'src/modules/motor-cover/models/motor-cover-request.model';
import { TravelPlan } from 'src/modules/travel-cover/models/travel-plan.model';
import { CallbackDataDto } from '../dtos/callback-data.dto';
import { InitiateSelcomTransactionDto } from '../dtos/initiate-selcom-transaction.dto';
import { TransactionPaymentResultDto } from '../dtos/transaction-payment.result.dto';
import { Transaction } from '../models/transaction.model';
import * as generateUniqueId from 'generate-unique-id';
import { TransactionStatusEnum } from '../enums/transaction.enum';
import { InjectQueue, Process } from '@nestjs/bull';
import {
  MOTOR_COVER_QUEUE,
  TRANSACTION_CALLBACK_JOB,
  TRANSACTION_CALLBACK_QUEUE,
} from 'src/shared/sms/constants';
import { Job, Queue } from 'bull';
import { MotorCovernoteService } from 'src/modules/motor-cover/providers/motor-covernote.service';

@Injectable()
export class TransactionService {
  private logger: Logger = new Logger();

  constructor(
    private httpService: HttpService,
    @InjectQueue(TRANSACTION_CALLBACK_QUEUE)
    private readonly transactionCallbackQueue: Queue,
    @InjectQueue(MOTOR_COVER_QUEUE)
    private readonly motorCoverQueue: Queue,
  ) {}

  async payForTravelCover(
    travelCoverRequestId: number,
    plan: TravelPlan,
    customer: Customer,
    email: string,
  ): Promise<TransactionPaymentResultDto> {
    const selcomData = new InitiateSelcomTransactionDto();

    const reference =
      'SITLREQTRAV' + generateUniqueId({ length: 7, useLetters: false });

    selcomData.amount = plan.price;
    selcomData.buyerEmail = email;
    selcomData.buyerName = `${customer.firstName} ${customer.lastName}`;
    selcomData.buyerPhone = customer.phone.substring(1);
    selcomData.currency = plan.currency;
    selcomData.noOfItems = 1;
    selcomData.orderId = reference;

    const result = await this.initiateSelcomTransaction(selcomData);

    this.logger.log(result);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        transaction: null,
      };
    }

    const transaction = new Transaction();

    transaction.amount = plan.price;
    transaction.currency = plan.currency;
    transaction.customerId = customer.id;
    transaction.travelCoverRequestId = travelCoverRequestId;
    transaction.operatorReferenceId = result.data.reference;
    transaction.provider = 'SELCOM';
    transaction.reference = reference;

    await transaction.save();

    return {
      success: true,
      transaction,
      message: 'success',
      redirectUrl: Buffer.from(
        result.data.data[0].payment_gateway_url,
        'base64url',
      ).toString('ascii'),
    };
  }

  async payForMotorCover(
    motorCoverRequest: MotorCoverRequest,
    customer: Customer,
    email: string,
  ): Promise<TransactionPaymentResultDto> {
    const selcomData = new InitiateSelcomTransactionDto();

    const reference =
      'SITLREQMOT' + generateUniqueId({ length: 7, useLetters: false });

    selcomData.amount = motorCoverRequest.minimumAmountIncTax;
    selcomData.buyerEmail = email;
    selcomData.buyerName = `${customer.firstName} ${customer.lastName}`;
    selcomData.buyerPhone = customer.phone.substring(1);
    selcomData.currency = motorCoverRequest.currency;
    selcomData.noOfItems = 1;
    selcomData.orderId = reference;

    const result = await this.initiateSelcomTransaction(selcomData);

    this.logger.log(result);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        transaction: null,
      };
    }

    const transaction = new Transaction();

    transaction.amount = motorCoverRequest.minimumAmountIncTax;
    transaction.currency = motorCoverRequest.currency;
    transaction.customerId = customer.id;
    transaction.motorCoverRequestId = motorCoverRequest.id;
    transaction.operatorReferenceId = result.data.reference;
    transaction.provider = 'SELCOM';
    transaction.reference = reference;

    await transaction.save();

    return {
      success: true,
      transaction,
      message: 'success',
      redirectUrl: Buffer.from(
        result.data.data[0].payment_gateway_url,
        'base64url',
      ).toString('ascii'),
    };
  }

  async initiateSelcomTransaction(data: InitiateSelcomTransactionDto) {
    const {
      amount,
      buyerEmail,
      buyerName,
      buyerPhone,
      currency,
      noOfItems,
      orderId,
    } = data;

    const payload = this.transformPayload({
      vendor: selcomConfig.selcomVendor,
      amount,
      buyerEmail,
      buyerName,
      buyerPhone,
      currency,
      noOfItems,
      orderId,
      webhook: Buffer.from(
        `${selcomConfig.selcomCallbackUrl}/transactions/callback`,
      ).toString('base64'),
    });
    const headers = this.getHeaders(payload);

    this.logger.log(payload);

    this.logger.log(headers);

    try {
      const result = await this.httpService
        .post(
          `${selcomConfig.selcomApiBaseUrl}/checkout/create-order-minimal`,
          payload,
          {
            headers: {
              'Content-type': 'application/json',
              Accept: 'application/json',
              ...headers,
            },
          },
        )
        .toPromise();

      return {
        success: true,
        message: 'Successfully inititated selcom transaction',
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: error.response.data,
      };
    }
  }

  getHeaders(body: any) {
    const authorization =
      `SELCOM ` + Buffer.from(selcomConfig.selcomApiKey).toString('base64');

    const timestamp = moment().format();
    const digestMethod = 'HS256';
    const digest = createHmac('SHA256', selcomConfig.selcomApiSecret)
      .update(
        `timestamp=${timestamp}&` +
          Object.keys(body)
            .map((key) => key + '=' + body[key])
            .join('&'),
      )
      .digest('base64');

    const signedFields = Object.keys(body).join(',');

    return {
      Authorization: authorization,
      'Digest-Method': digestMethod,
      Digest: digest,
      Timestamp: timestamp,
      'Signed-Fields': signedFields,
    };
  }

  transformPayload(data: any) {
    return {
      vendor: data.vendor,
      amount: data.amount,
      buyer_email: data.buyerEmail,
      buyer_name: data.buyerName,
      buyer_phone: data.buyerPhone,
      currency: data.currency,
      no_of_items: data.noOfItems,
      order_id: data.orderId,
      webhook: data.webhook,
    };
  }

  async callback(data: CallbackDataDto) {
    this.logger.log(`Add callback to queue, Payload: ${JSON.stringify(data)}`);

    const job = await this.transactionCallbackQueue.add(
      TRANSACTION_CALLBACK_JOB,
      data,
    );

    this.logger.verbose(`Transaction callback jobId ${job.id}`);

    return {
      success: true,
      message: 'Success',
    };
  }

  @Process(TRANSACTION_CALLBACK_JOB)
  async processCallbackQueue(job: Job<CallbackDataDto>) {
    const data = Object.assign(new CallbackDataDto(), job.data);

    this.logger.verbose(
      `Processing Transaction callback job ID:${job.id}, ${JSON.stringify(
        data,
      )}`,
    );

    const { transid, result, reference, payment_status } = data;

    const transaction = await Transaction.findOne({ reference: transid });

    if (result === 'SUCCESS' && payment_status === 'COMPLETED') {
      transaction.status = TransactionStatusEnum.SUCCESS;
      transaction.operatorReferenceId = reference;
    }

    if (result === 'FAIL') {
      transaction.status = TransactionStatusEnum.FAILED;
      transaction.operatorReferenceId = reference;
    }

    await transaction.save();

    // Process cover

    await this.motorCoverQueue.add(transaction);
  }
}
