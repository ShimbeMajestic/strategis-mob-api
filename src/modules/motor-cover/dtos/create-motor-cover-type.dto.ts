import { Field, InputType } from '@nestjs/graphql';
import { MotorCategory } from '../enums/motor-category.enum';
import { MotorUsage, MotorUsageType } from '../enums/motor-usage.enum';

@InputType()
export class CreateMotorCoverTypeDto {
  @Field()
  productCode: string;

  @Field()
  productName: string;

  @Field()
  riskName: string;

  @Field()
  riskCode: string;

  @Field()
  rate: number;

  @Field()
  minimumAmount: number;

  @Field()
  perSeatAmount: number;

  @Field()
  usage: MotorUsageType;
}
