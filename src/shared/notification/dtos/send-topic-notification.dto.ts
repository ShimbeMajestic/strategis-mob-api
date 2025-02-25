import { Field, InputType } from '@nestjs/graphql';
import { SendNotificationDto } from './send-device-notification.dto';

@InputType()
export class SendTopicNotificationDto extends SendNotificationDto {
    @Field()
    topic: string;
}
