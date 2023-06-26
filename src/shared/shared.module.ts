import { Module } from '@nestjs/common';
import { BullUiModule } from './bull-ui/bull-ui.module';
import { PaymentModule } from './payment/payment.module';
import { SmsModule } from './sms/sms.module';
import { NotificationModule } from './notification/notification.module';

@Module({
    imports: [SmsModule, PaymentModule, NotificationModule, BullUiModule],
    exports: [SmsModule, PaymentModule, NotificationModule],
})
export class SharedModule {}
