import { InputType } from '@nestjs/graphql';
import { CreateHospitalDto } from './create-hospitals.dto';

@InputType()
export class UpdateHospitalDto extends CreateHospitalDto {}
