import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class GetTravelPlansDto {
  @Field()
  @IsNotEmpty()
  destinationId: string;

  @Field()
  @IsNotEmpty()
  entityTypeId: string;
}
