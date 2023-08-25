import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class VehicleDetailRequestDto {
    @Field()
    @IsNotEmpty()
    motorCoverReqId?: number;

    @Field()
    @IsNotEmpty()
    coverNoteStartDate: Date;

    @Field({ nullable: true })
    @IsOptional()
    registrationNumber?: string;

    @Field({ nullable: true })
    @IsOptional()
    chassisNumber?: string;
}
