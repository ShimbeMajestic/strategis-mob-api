import { Module } from '@nestjs/common';
import { BullUiModule } from './bull-ui/bull-ui.module';
import { SmsModule } from './sms/sms.module';
import { NotificationModule } from './notification/notification.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
    imports: [
        SmsModule, //
        NotificationModule,
        UploadsModule,
        BullUiModule,
    ],
    exports: [
        SmsModule, //
        NotificationModule,
        UploadsModule,
    ],
})
export class SharedModule { }
