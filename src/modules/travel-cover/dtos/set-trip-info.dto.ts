import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SetTripInformationDto {
    @Field()
    name: string;

    @Field()
    gender: string;

    @Field()
    dateOfBirth: Date;

    @Field()
    email: string;

    @Field()
    returnDate: Date;

    @Field()
    departureDate: Date;

    @Field()
    passportNo: string;

    @Field()
    requestId: number;
}
