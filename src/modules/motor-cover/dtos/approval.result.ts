import { Field, ObjectType } from '@nestjs/graphql';
import { MotorCoverRequest } from '../models/motor-cover-request.model';

@ObjectType()
export class ApprovalResult {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field({ nullable: true })
    data: MotorCoverRequest;
}
