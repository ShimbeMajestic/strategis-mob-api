import { Field, InputType, Int } from '@nestjs/graphql';
import { 
  IsBoolean, 
  IsDate, 
  IsInt, 
  IsOptional, 
  IsString, 
  IsUUID, 
  IsArray, 
  ArrayMinSize 
} from 'class-validator';

/**
 * DTO for creating a new insurance claim.
 * Defines the structure of the data when creating a claim.
 */
@InputType()
export class CreateClaimDto {
  @Field(() => String)
  @IsUUID()
  claimId: string; // Ensures each claim has a unique identifier

  @Field(() => Int)
  @IsInt({ message: 'Customer ID must be an integer' })
  customerId: number; // ID of the customer submitting the claim

  @Field(() => Int)
  @IsInt({ message: 'Policy ID must be an integer' })
  policyId: number; // ID of the insurance policy related to the claim

  @Field()
  @IsDate({ message: 'Invalid date format for dateOfAccident' })
  dateOfAccident: Date; // Date when the accident occurred

  @Field()
  @IsString({ message: 'Location must be a string' })
  locationOfAccident: string; // Location where the accident took place

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Alternate phone number must be a valid string' })
  alternatePhoneNumber?: string; // Alternate phone number for contacting the claimant

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Image URLs must be an array' })
  @ArrayMinSize(1, { message: 'At least one image URL is required' })
  imageUrls?: string[]; // List of image URLs documenting the accident

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
