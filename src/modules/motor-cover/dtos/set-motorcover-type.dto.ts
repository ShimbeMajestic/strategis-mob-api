import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SetMotorCoverType {
    @Field()
    @IsNotEmpty()
    coverTypedId: number;

    @Field()
    @IsNotEmpty()
    requestId: number;
}
