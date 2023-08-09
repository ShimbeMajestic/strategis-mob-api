import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SetTripInformationDto {
    @Field()
    returnDate: Date;

    @Field()
    departureDate: Date;

    @Field()
    passportNo: string;

    @Field()
    requestId: number;
}
