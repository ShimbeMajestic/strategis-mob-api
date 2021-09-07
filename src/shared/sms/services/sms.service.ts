import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { SMS_JOB, SMS_QUEUE } from '../constants';
import { SendSMSDto } from '../dtos/SendSMS.dto';


@Injectable()
export class SmsService {

    protected readonly logger = new Logger(SmsService.name);

    constructor(
        @InjectQueue(SMS_QUEUE)
        private readonly smsQueue: Queue,
    ) { }

    async sendSms(smsDto: SendSMSDto): Promise<void> {

        // Dispatch SMS job to queue
        this.logger.verbose(`Dispatching SMS job ${JSON.stringify(smsDto)}`);
        const job = await this.smsQueue.add(SMS_JOB, smsDto);

        this.logger.verbose(`SMS jobId ${job.id}`);
    }
}
