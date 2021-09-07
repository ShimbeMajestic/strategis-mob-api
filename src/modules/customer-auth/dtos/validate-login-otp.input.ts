import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ValidateLoginOtpInput {
    @Field()
    otp: string;

    @Field()
    nonce: string;
}
