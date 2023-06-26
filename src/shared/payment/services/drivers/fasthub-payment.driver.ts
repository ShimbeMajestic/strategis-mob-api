import { Injectable, Logger } from '@nestjs/common';
import { paymentConfig } from 'src/config/payment.config';
import { PaymentCallback } from '../../dtos/payment.callback';
import { PaymentDto } from '../../dtos/payment.dto';
import { PaymentDriver } from './payment-driver.interface';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FasthubPayment implements PaymentDriver {
    constructor(private httpService: HttpService) {}

    private readonly logger = new Logger('FastHubPayment');

    async sendPush(paymentDto: PaymentDto): Promise<any> {
        const channelID =
            paymentDto.operator == 'TIGOPESA' ||
            paymentDto.operator == 'AIRTELMONEY'
                ? paymentConfig.fastHub.channelID
                : paymentConfig.fastHub.altChannelID;
        const endpoint =
            paymentDto.operator == 'TIGOPESA' ||
            paymentDto.operator == 'AIRTELMONEY'
                ? paymentConfig.fastHub.endpoint
                : paymentConfig.fastHub.altEndpoint;

        delete paymentDto.operator;

        const hash = await this.hashRequest(paymentDto, channelID);
        const request = {
            hash,
            channel: parseInt(channelID),
            callback_url: paymentConfig.callback,
            recipient: paymentDto.recipient,
            amount: paymentDto.amount.toFixed(1),
            reference_id: paymentDto.referenceID,
            bill_ref: paymentDto.billRef,
            transactionTypeName: 'Debit',
        };

        this.logger.verbose(JSON.stringify(request));

        try {
            const result = await this.httpService
                .post(
                    endpoint,
                    { request },
                    {
                        auth: {
                            username: paymentConfig.fastHub.username,
                            password: paymentConfig.fastHub.password,
                        },
                    },
                )
                .toPromise();

            return result.data;
        } catch (error) {
            this.logger.error(error.message);
            return {
                status: error.response.status,
                message: error.response.data,
                isSuccessful: false,
            };
        }
    }
    callback(callbackDetails: PaymentCallback): Promise<boolean> {
        this.logger.log(JSON.stringify(callbackDetails));
        throw new Error('Method not implemented.');
    }

    protected async hashRequest(
        paymentDto: PaymentDto,
        channelID: string,
    ): Promise<string> {
        const hashString = `amount=${paymentDto.amount.toFixed(
            1,
        )}&channel=${parseInt(channelID)}&callback_url=${encodeURIComponent(
            paymentConfig.callback,
        )}&recipient=${paymentDto.recipient}&reference_id=${
            paymentDto.referenceID
        }&trx_date=`;
        this.logger.debug(hashString);
        this.logger.debug(paymentConfig.fastHub.key);

        var CryptoJS = require('crypto-js');
        const hash = CryptoJS.HmacSHA256(
            hashString,
            paymentConfig.fastHub.key,
        ).toString();
        return hash;
    }
}
