import { Injectable } from '@nestjs/common';
import { SendNotificationDto } from '../dtos/send-device-notification.dto';
import { SendTopicNotificationDto } from '../dtos/send-topic-notification.dto';
import { TestNotificationDto } from '../dtos/test-notification.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseNotificationService {
    async testNotification(notificationData: TestNotificationDto) {
        const { title, body, token } = notificationData;

        const message = {
            notification: {
                title,
                body,
            },
            token,
        };

        const result = await admin.messaging().send(message);
        return result;
    }

    async notifyCustomersTopic(notificationDto: SendTopicNotificationDto) {
        const { title, body, image, topic } = notificationDto;

        const result = await admin.messaging().sendToTopic(topic, {
            notification: {
                title,
                body,
            },
            data: {
                image,
            },
        });
        return result;
    }

    async notifyCustomer(notificationDto: SendNotificationDto) {
        const { title, body, image, token } = notificationDto;

        const result = await admin.messaging().sendToDevice(token, {
            notification: {
                title,
                body,
                image,
            },
        });

        return result;
    }
}
