import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber } from 'class-validator';

@InputType()
export class RequestLoginOtpInput {
    @IsPhoneNumber('TZ')
    @Field()
    phone: string;

    @Field({
        nullable: true,
        deprecationReason:
            'Use of this input discouraged, as it allows api caller to send arbitrary SMS content to any number, which can be exploited as security loophole',
    })
    deviceSignature: string;
}
