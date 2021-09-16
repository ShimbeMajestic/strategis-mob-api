import { BadRequestException, Injectable } from "@nestjs/common";
import { Customer } from "src/modules/customer/models/customer.model";
import { GetVehicleDetailsDto } from "../dtos/get-vehicle-details.response";
import { SetMotorCoverDurationDto } from "../dtos/set-motorcover-duration.dto";
import { VehicleDetailRequestDto } from "../dtos/vehicle-detail.request";
import { MotorCoverRequest } from "../models/mover-cover-req.model";
import { VehicleDetails } from "../models/vehicle-details.model";
import { VehicleDetailService } from "./vehicle-detail.service";

@Injectable()
export class MotorCovernoteService {
    constructor(
        private readonly vehicleDetailService: VehicleDetailService
    ) { }

    async setMotorCoverAndDuration(input: SetMotorCoverDurationDto, customer: Customer): Promise<MotorCoverRequest> {
        const { motorCoverId, motorCoverDurationId } = input;

        const motorCoverRequest = new MotorCoverRequest()
        motorCoverRequest.motorCoverId = motorCoverId;
        motorCoverRequest.customer = customer;

        if (motorCoverDurationId)
            motorCoverRequest.motorCoverDurationId = motorCoverDurationId;

        await motorCoverRequest.save()

        return motorCoverRequest;
    }

    async getVehicleDetails(input: VehicleDetailRequestDto): Promise<GetVehicleDetailsDto> {

        const { motorCoverReqId } = input;

        const motorCoverRequest = await MotorCoverRequest.findOne({ id: motorCoverReqId });

        if (!motorCoverRequest) {
            throw new BadRequestException('Invalid motor cover request id!')
        }

        const result = await this.vehicleDetailService.execute(input);

        if (result.headers.ResponseStatusCode !== 'TIRA001') {
            return {
                success: false,
                message: "Vehicle Details not found from TIRA",
                data: null
            }
        }

        const vehicleDetails = new VehicleDetails()
        Object.assign(vehicleDetails, result.data);

        await vehicleDetails.save()

        motorCoverRequest.vehicleDetails = vehicleDetails;
        motorCoverRequest.vehicleDetailsId = vehicleDetails.id;

        await motorCoverRequest.save()

        return {
            success: true,
            message: "Successfully got vehicle details, proceed",
            data: vehicleDetails
        }

    }
}