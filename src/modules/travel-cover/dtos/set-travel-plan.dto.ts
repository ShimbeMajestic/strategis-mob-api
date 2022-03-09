import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SetTravelPlanDto {
  @Field()
  planId: number;
}
