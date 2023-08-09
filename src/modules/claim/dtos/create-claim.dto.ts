import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateClaimDto {
    @Field()
    customerId: number;

    @Field()
    policyId: number;

    @Field()
    dateOfAccident: Date;

    @Field()
    locationOfAccident: string;

    @Field()
    alternatePhoneNumber: string;

    @Field(() => [String])
    imageUrls: string[];
}
