import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTravelPlanDto {
  @Field()
  title: string;

  @Field()
  duration: number;

  @Field()
  destinationId: number;

  @Field()
  price: number;

  @Field()
  currency: string;

  @Field({ nullable: true })
  package?: string;

  @Field()
  travelEntityId: number;
}
