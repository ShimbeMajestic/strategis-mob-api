import { InputType } from '@nestjs/graphql';
import { CreateTravelPlanDto } from './create-travel-plan.dto';

@InputType()
export class UpdateTravelPlanDto extends CreateTravelPlanDto {}
