import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Hmac, createHmac } from 'crypto';
import * as moment from 'moment';
import { selcomConfig } from 'src/config/selcom.config';
import { InitiateSelcomTransactionDto } from '../dtos/initiate-selcom-transaction.dto';

@Injectable()
export class TransactionService {
  private logger: Logger = new Logger();

  constructor(private httpService: HttpService) {}

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
        'https://strategies-api.codeblock.co.tz/transactions/callback',
      ).toString('base64'),
    });
    const headers = this.getHeaders(payload);
    console.log(payload);
    console.log(headers);
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

      return result.data;
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

  async callback(data: any) {
    console.log('LOGGING CALLBACK DATA');
    this.logger.log(data);
  }
}
