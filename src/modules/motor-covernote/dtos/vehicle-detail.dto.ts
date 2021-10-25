import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { MotorCategory } from '../enums/motor-category.enum';

@InputType()
export class CreateVehicleDetailDto {
  @Field()
  @IsNotEmpty()
  requestId: number;

  @Field()
  MotorCategory: MotorCategory;

  @Field()
  RegistrationNumber: string;

  @Field()
  BodyType: string;

  @Field()
  ChassisNumber?: string;

  @Field()
  Make?: string;

  @Field()
  Model?: string;

  @Field()
  ModelNumber?: string;

  @Field()
  Color?: string;

  @Field()
  EngineNumber?: string;

  @Field()
  EngineCapacity?: number;

  @Field()
  FuelUsed?: string;

  @Field()
  YearOfManufacture?: number;

  @Field()
  TareWeight?: number;

  @Field()
  GrossWeight?: number;

  @Field()
  MotorUsage?: string;

  @Field()
  OwnerName?: string;

  @Field()
  OwnerCategory?: string;

  @Field({ nullable: true })
  SittingCapacity?: number;

  @Field({ nullable: true })
  value?: number;
}
