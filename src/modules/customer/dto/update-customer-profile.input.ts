import { Field, InputType } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import {
    IsValidEnumValue,
    IdNumberLengthValidator,
} from '../enum/id-type-validator';
import { IdType } from '../enum/id-type.enum';
import { IsOldEnoughValidator } from '../enum/age-validator';

@InputType()
export class UpdateCustomerProfileInput {
    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    middleName?: string;

    @Field({ nullable: true })
    regionId?: number;

    @Field({ nullable: true })
    token?: string;

    @Field({ nullable: true })
    @Validate(IsValidEnumValue)
    identityType?: IdType;

    @Field({ nullable: true })
    @Validate(IdNumberLengthValidator)
    identityNumber?: string;

    @Field({ nullable: true })
    @Validate(IsOldEnoughValidator)
    dob?: string;

    @Field({ nullable: true })
    location?: string;

    @Field({ nullable: true })
    district?: string;

    @Field({ nullable: true })
    gender?: string;
}
