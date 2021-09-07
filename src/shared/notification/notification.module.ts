import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { redisConfig } from 'src/config/redis.config';
import { PUSH_NOTIFICATION_QUEUE, PUSH_NOTIFICATION_TOPIC_QUEUE } from './constants';
import { FirebaseNotificationService } from './drivers/firebase-notification.driver';
import { NotificationController } from './notification.controller';
import { NotificationConsumer, NotificationTopicConsumer } from './services/notification.consumer';
import { NotificationService } from './services/notification.service';

@Module({
    imports: [
        BullModule.registerQueue(
            {
                name: PUSH_NOTIFICATION_TOPIC_QUEUE,
                redis: redisConfig.bullQueue,
                defaultJobOptions: {
                    lifo: true,
                    attempts: 5,
                    backoff: {
                        type: 'exponential',
                        delay: 5000,
                    },
                },
            },
            {
                name: PUSH_NOTIFICATION_QUEUE,
                redis: redisConfig.bullQueue,
                defaultJobOptions: {
                    lifo: true,
                    attempts: 5,
                    backoff: {
                        type: 'exponential',
                        delay: 5000,
                    },
                },
            }
        ),
    ],
    providers: [
        NotificationService,
        FirebaseNotificationService,
        NotificationTopicConsumer,
        NotificationConsumer
    ],
    controllers: [NotificationController],
    exports: [
        NotificationService
    ]
})
export class NotificationModule { }
