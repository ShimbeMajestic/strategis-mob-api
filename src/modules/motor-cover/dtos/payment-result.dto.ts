import { Field, ObjectType } from '@nestjs/graphql';
import { MotorCoverRequest } from '../models/motor-cover-request.model';

@ObjectType()
export class PaymentResult {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field()
    data: MotorCoverRequest;
}
