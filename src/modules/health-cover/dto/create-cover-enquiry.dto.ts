import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateHealthCoverEnquiryDto {
    @Field({ nullable: true })
    customerId?: number;

    @Field()
    customerName: string;

    @Field()
    city: string;

    @Field()
    age: number;

    @Field()
    gender: string;

    @Field()
    numberOfDependents: number;

    @Field()
    mobileNumber: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    healthPlanId: number;
}
