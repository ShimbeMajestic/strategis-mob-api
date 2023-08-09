import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
    PUSH_NOTIFICATION_JOB,
    PUSH_NOTIFICATION_QUEUE,
    PUSH_NOTIFICATION_TOPIC_JOB,
    PUSH_NOTIFICATION_TOPIC_QUEUE,
} from '../constants';
import { FirebaseNotificationService } from '../drivers/firebase-notification.driver';
import { SendNotificationDto } from '../dtos/send-device-notification.dto';
import { SendTopicNotificationDto } from '../dtos/send-topic-notification.dto';

@Processor(PUSH_NOTIFICATION_QUEUE)
export class NotificationConsumer {
    protected readonly logger = new Logger(NotificationConsumer.name);

    constructor(
        protected readonly firebaseService: FirebaseNotificationService,
    ) {}

    // Process push notification jobs from queue
    @Process(PUSH_NOTIFICATION_JOB)
    async processPushNotificationQueue(
        job: Job<SendNotificationDto>,
    ): Promise<void> {
        const data = Object.assign(new SendNotificationDto(), job.data); // deserialize job data into Sendpush notificationDto class

        this.logger.verbose(
            `Processing push notification job ID:${job.id}, ${JSON.stringify(
                data,
            )}`,
        );

        await this.firebaseService.notifyCustomer(data).catch((error) => {
            this.logger.error(error.message);

            throw error; // rethrow exception
        });
    }
}

@Processor(PUSH_NOTIFICATION_TOPIC_QUEUE)
export class NotificationTopicConsumer {
    protected readonly logger = new Logger(NotificationTopicConsumer.name);

    constructor(
        protected readonly firebaseService: FirebaseNotificationService,
    ) {}

    // Process push notification jobs from queue
    @Process(PUSH_NOTIFICATION_TOPIC_JOB)
    async processPushNotificationQueue(
        job: Job<SendTopicNotificationDto>,
    ): Promise<void> {
        const data = Object.assign(new SendTopicNotificationDto(), job.data); // deserialize job data into Sendpush notificationDto class

        this.logger.verbose(
            `Processing push notification job ID:${job.id}, ${JSON.stringify(
                data,
            )}`,
        );

        await this.firebaseService.notifyCustomersTopic(data).catch((error) => {
            this.logger.error(error.message);

            throw error; // rethrow exception
        });
    }
}
