import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SMS_DRIVER, SMS_JOB, SMS_QUEUE } from '../constants';
import { SendSMSDto } from '../dtos/SendSMS.dto';
import { SmsDriver } from './drivers/sms-driver.interface';

@Processor(SMS_QUEUE)
export class SmsConsumer {
    protected readonly logger = new Logger(SmsConsumer.name);

    constructor(
        @Inject(SMS_DRIVER)
        protected readonly smsDriver: SmsDriver,
    ) {}

    // Process SMS jobs from queue
    @Process(SMS_JOB)
    async processSmsQueue(job: Job<SendSMSDto>): Promise<void> {
        const data = Object.assign(new SendSMSDto(), job.data); // deserialize job data into SendSMSDto class

        this.logger.verbose(
            `Processing SMS job ID:${job.id}, ${JSON.stringify(data)}`,
        );

        await this.smsDriver.sendSms(data).catch((error) => {
            this.logger.error(error.message);

            throw error; // rethrow exception
        });
    }
}
