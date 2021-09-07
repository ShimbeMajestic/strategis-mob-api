import { Injectable, Logger } from '@nestjs/common';
import { SmsDriver } from './sms-driver.interface';
import { SendSMSDto } from '../../dtos/SendSMS.dto';

/**
 * This is a DEBUG SMS driver for local development.
 * Only logs messages to standard output.
 */
@Injectable()
export class LogSms implements SmsDriver {
    private readonly logger = new Logger('LogSms');

    async sendSms(sms: SendSMSDto) {
        let log = `\n===============SMS-START====================`;
        log += `\n${sms.message}`;
        log += `\n===============SMS-END===================`;

        this.logger.debug(log);
    }
}
