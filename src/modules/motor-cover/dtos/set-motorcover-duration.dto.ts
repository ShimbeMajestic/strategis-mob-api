import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class SetMotorCoverDurationDto {
    @Field()
    @IsNotEmpty()
    motorCoverId: number;

    @Field({ nullable: true })
    @IsOptional()
    motorCoverDurationId: number;
}

@InputType()
export class SetMotorCoverDurationInput {
    @Field()
    @IsNotEmpty()
    motorCoverRequestId: number;

    @Field()
    @IsNotEmpty()
    motorCoverDurationId: number;
}