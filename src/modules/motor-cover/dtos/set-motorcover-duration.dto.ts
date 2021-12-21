import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { VehicleTypeEnum } from '../enums/vehicle-type.enum';

@InputType()
export class SetMotorCoverDurationDto {
  @Field()
  @IsNotEmpty()
  motorCoverId: number;

  @Field({ nullable: true })
  @IsOptional()
  motorCoverDurationId: number;

  @Field()
  @IsNotEmpty()
  vehicleType: VehicleTypeEnum;
}
