import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bull";
import { PUSH_NOTIFICATION_JOB, PUSH_NOTIFICATION_QUEUE, PUSH_NOTIFICATION_TOPIC_JOB, PUSH_NOTIFICATION_TOPIC_QUEUE } from "../constants";
import { SendNotificationDto } from "../dtos/send-device-notification.dto";
import { SendTopicNotificationDto } from "../dtos/send-topic-notification.dto";

@Injectable()
export class NotificationService {
    protected readonly logger = new Logger(NotificationService.name);

    constructor(
        @InjectQueue(PUSH_NOTIFICATION_QUEUE)
        private readonly notificationQueue: Queue,

        @InjectQueue(PUSH_NOTIFICATION_TOPIC_QUEUE)
        private readonly topicNotificationQueue: Queue,
    ) { }

    async sendNotificationToDevice(pushDto: SendNotificationDto): Promise<void> {

        // Dispatch Push Notification job to queue
        this.logger.verbose(`Dispatching Push notification job ${JSON.stringify(pushDto)}`);
        const job = await this.notificationQueue.add(PUSH_NOTIFICATION_JOB, pushDto);

        this.logger.verbose(`Push notification jobId ${job.id}`);
    }

    async sendNotificationToTopic(pushDto: SendTopicNotificationDto): Promise<void> {

        // Dispatch Push notification job to queue
        this.logger.verbose(`Dispatching push notification job to topic ${JSON.stringify(pushDto)}`);
        const job = await this.topicNotificationQueue.add(PUSH_NOTIFICATION_TOPIC_JOB, pushDto);

        this.logger.verbose(`Push notification jobId ${job.id}`);
    }
}