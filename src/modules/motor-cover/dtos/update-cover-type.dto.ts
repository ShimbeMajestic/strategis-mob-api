import { InputType } from "@nestjs/graphql";
import { CreateMotorCoverTypeDto } from "./create-motor-cover-type.dto";

@InputType()
export class UpdateMotorCoverTypeDto extends CreateMotorCoverTypeDto { }