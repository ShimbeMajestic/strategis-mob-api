import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateClaimDto {
  @Field()
  customerId: number;

  @Field()
  policyId: number;
}
