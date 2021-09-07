import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RequestLoginOtpResponse {
    @Field()
    nonce: string;

    @Field({ nullable: true })
    otpMessage: string;

    @Field({ nullable: true })
    otpLength: number;

    @Field({ nullable: true })
    otpExpiresAt: Date;
}
