import { BullModule } from '@nestjs/bull';
import { redisConfig } from 'src/config/redis.config';
import { smsConfig } from 'src/config/sms.config';
import { SMS_DRIVER, SMS_QUEUE } from './constants';
import { InfobipSms } from './services/drivers/infobip-sms.driver';
import { LogSms } from './services/drivers/log-sms.driver';
import { SmsConsumer } from './services/sms.consumer';
import { SmsService } from './services/sms.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        HttpModule,
        BullModule.registerQueue({
            name: SMS_QUEUE,
            redis: redisConfig.bullQueue,
            defaultJobOptions: {
                lifo: true,
                attempts: 15,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
            },
        }),
    ],
    providers: [
        SmsService,
        SmsConsumer,
        {
            provide: SMS_DRIVER,
            useClass: smsConfig.driver === 'log' ? LogSms : InfobipSms,
        },
    ],
    exports: [SmsService],
})
export class SmsModule {}
