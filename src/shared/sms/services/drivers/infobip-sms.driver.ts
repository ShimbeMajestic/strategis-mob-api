import {
    HttpService,
    Inject,
    Injectable,
    Logger
} from '@nestjs/common';
import { smsConfig } from '../../../../config/sms.config';
import { SendSMSDto } from '../../dtos/SendSMS.dto';
import { SmsDriver } from './sms-driver.interface';

/**
 * This SMS driver relays messages using Fasthub SMS gateway
 */
@Injectable()
export class InfobipSms implements SmsDriver {
    private logger = new Logger(InfobipSms.name);

    constructor(
        private httpService: HttpService,
    ) { }

    async sendSms(smsDto: SendSMSDto): Promise<void> {
        const { infobip } = smsConfig;

        const formattedRecipient = smsDto.to;

        const payload = {
            messages: [
                {
                    "destinations": [
                        {
                            "to": formattedRecipient
                        }
                    ],
                    "text": smsDto.message,
                    "from": infobip.defaultSender
                }
            ]
        };

        const endpoint = infobip.baseUrl + 'sms/2/text/advanced';

        this.logger.log('Calling Infobip');

        try {
            // Post request
            const result = await this.httpPost(endpoint, payload);
            this.logger.log(`SMS Response from Infobip: ${result.statusText}`)

        } catch (error) {
            // On error
            this.logger.error(error.message);
        }

    }

    async httpPost(endpoint: string, payload: any) {
        return this.httpService
            .post(endpoint, payload, {
                headers: {
                    "Authorization": `App ${smsConfig.infobip.apiKey}`
                }
            })
            .toPromise();
    }
}
