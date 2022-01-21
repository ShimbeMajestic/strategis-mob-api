import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SetVehicleImagesDto {
  @Field()
  @IsNotEmpty()
  requestId: number;

  @Field()
  @IsNotEmpty()
  backViewImageUrl: string;

  @Field()
  @IsNotEmpty()
  frontViewImageUrl: string;

  @Field()
  @IsNotEmpty()
  leftSideViewImageUrl: string;

  @Field()
  @IsNotEmpty()
  rightSideViewImageUrl: string;

  @Field()
  @IsNotEmpty()
  bonnetViewImageUrl: string;

  @Field()
  @IsNotEmpty()
  dashboardOdoImageUrl: string;
}
