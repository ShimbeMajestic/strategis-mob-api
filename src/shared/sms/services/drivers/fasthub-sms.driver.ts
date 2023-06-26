import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { smsConfig } from 'src/config/sms.config';
import { SendSMSDto } from '../../dtos/SendSMS.dto';
import { SmsDriver } from './sms-driver.interface';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';

/**
 * This SMS driver relays messages using Fasthub SMS gateway
 */
@Injectable()
export class FastHubSms implements SmsDriver {
    private readonly logger = new Logger('FastHubSms');

    constructor(private httpService: HttpService) {}

    async sendSms(smsDto: SendSMSDto): Promise<void> {
        const { fastHub } = smsConfig;

        const rawMsisdn = smsDto.to;
        const normalizedMsisdn = '255' + rawMsisdn.slice(-9);
        const message = {
            text: smsDto.message,
            msisdn: normalizedMsisdn,
            source: fastHub.defaultSenderID,
        };

        // Encode password
        const encPassword = this.encodePassword(fastHub.channelPassword);

        const jsonPayload = {
            channel: {
                channel: fastHub.channelID,
                password: encPassword,
            },
            messages: [message],
        };

        const endpoint = fastHub.endpoint;
        this.logger.debug(endpoint);
        this.logger.debug(jsonPayload);

        // Post request
        await this.httpPost(endpoint, jsonPayload);
    }

    protected async httpPost(endpoint: string, payload: any) {
        this.httpService
            .post(endpoint, payload)
            .toPromise()
            .then((response) => {
                if (response.status !== 200) {
                    throw new InternalServerErrorException(response.data);
                }

                this.logger.verbose(response.data);

                if (response.data.isSuccessful !== true) {
                    this.logger.error(response.data);
                    throw new InternalServerErrorException(response.data);
                }
            })
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    protected encodePassword(password: string): string {
        const hash = crypto.createHash('sha256').update(password).digest('hex');

        const encPassword = Buffer.from(hash).toString('base64');

        return encPassword;
    }
}
