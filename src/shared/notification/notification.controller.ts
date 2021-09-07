import { Body, Controller, Post } from "@nestjs/common";
import { TestNotificationDto } from "./dtos/test-notification.dto";
import { NotificationService } from "./services/notification.service";

@Controller('notifications')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @Post('test')
    test(@Body() body: TestNotificationDto) {
        return this.notificationService.sendNotificationToDevice(body);
    }
}