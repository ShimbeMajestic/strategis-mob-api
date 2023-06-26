import { BullModule } from "@nestjs/bull";
import { Module } from '@nestjs/common';
import { paymentConfig } from "src/config/payment.config";
import { redisConfig } from "src/config/redis.config";
import { PAYMENT_DRIVER, PAYMENT_QUEUE } from "./constants";
import { PaymentController } from "./payment.controller";
import { FasthubPayment } from "./services/drivers/fasthub-payment.driver";
import { LogPayment } from "./services/drivers/log-payment.driver";
import { PaymentService } from "./services/payment.service";
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
        BullModule.registerQueue({
            name: PAYMENT_QUEUE,
            redis: redisConfig.bullQueue,
        }),
    ],
    providers: [
        PaymentService,
        {
            provide: PAYMENT_DRIVER,
            useClass: paymentConfig.driver === 'log' ? LogPayment : FasthubPayment,
        }
    ],
    controllers: [
        PaymentController
    ],
    exports: [
        PaymentService
    ]
})
export class PaymentModule { }