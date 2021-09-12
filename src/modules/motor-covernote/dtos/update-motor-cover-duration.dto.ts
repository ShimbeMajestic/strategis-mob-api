import { InputType } from "@nestjs/graphql";
import { CreateMotorCoverDurationDto } from "./create-motor-cover-duration.dto";

@InputType()
export class UpdateMotorCoverDurationDto extends CreateMotorCoverDurationDto { }