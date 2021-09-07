import { SendSMSDto } from '../../dtos/SendSMS.dto';

/**
 * SMS driver contract.
 *
 * Implement this interface for custom SMS service provider implementations.
 */
export interface SmsDriver {
    sendSms(sms: SendSMSDto): Promise<void>;
}
