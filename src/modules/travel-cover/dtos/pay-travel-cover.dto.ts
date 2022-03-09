import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PayForTravelCoverDto {
  @Field()
  email: string;

  @Field()
  travelCoverRequestId: number;
}
