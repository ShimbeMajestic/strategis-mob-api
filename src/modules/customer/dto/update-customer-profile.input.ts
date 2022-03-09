import { Field, InputType } from '@nestjs/graphql';
import { IdType } from '../enum/id-type.enum';

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
  identityType?: IdType;

  @Field({ nullable: true })
  identityNumber?: string;

  @Field({ nullable: true })
  dob?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  district?: string;

  @Field({ nullable: true })
  gender?: string;
}
