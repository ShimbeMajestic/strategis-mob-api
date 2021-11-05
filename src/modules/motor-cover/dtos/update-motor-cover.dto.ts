import { InputType } from "@nestjs/graphql";
import { CreateMotorCoverDto } from "./create-motor-cover.dto";

@InputType()
export class UpdateMotorCoverDto extends CreateMotorCoverDto {

}