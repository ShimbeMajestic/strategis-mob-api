import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateClaimDto } from './create-claim.dto';

/**
 * DTO for stepwise updates of claim data
 */
@InputType()
export class UpdateClaimDto extends PartialType(CreateClaimDto) {
  @Field(() => String)
  @IsUUID()
  claimId: string; // Ensures claim updates are targeted correctly

  @Field({ nullable: true })
  @IsOptional()
  @IsDate({ message: 'Invalid date format for dateOfAccident' })
  dateOfAccident?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Location of accident must be a string' })
  locationOfAccident?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Alternate phone number must be a valid string' })
  alternatePhoneNumber?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  imageUrls?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Registration number must be a string' })
  registrationNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Covernote number must be a string' })
  covernoteNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Incident type must be a string' })
  incidentType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Region must be a string' })
  region?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'District must be a string' })
  district?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Street must be a string' })
  street?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Driver’s name must be a string' })
  driversName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Driver’s license must be a string' })
  driversLicense?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate({ message: 'Invalid date format for driver’s date of birth' })
  driversDateOfBirth?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'Value must be true or false' })
  isOtherPropertyDamaged?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'Value must be true or false' })
  isPersonInjured?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'Number of injured must be an integer' })
  numberOfInjured?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'Value must be true or false' })
  isDeath?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'Number of deaths must be an integer' })
  numberOfDeaths?: number;
}
