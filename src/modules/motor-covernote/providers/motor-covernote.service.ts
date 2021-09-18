import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Customer } from "src/modules/customer/models/customer.model";
import { GetVehicleDetailsDto } from "../dtos/get-vehicle-details.response";
import { SetMotorUsageTypeDto } from "../dtos/set-motor-usage-type.dto";
import { SetMotorCoverDurationDto } from "../dtos/set-motorcover-duration.dto";
import { CreateVehicleDetailDto } from "../dtos/vehicle-detail.dto";
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

    async setMotorUsageType(input: SetMotorUsageTypeDto): Promise<MotorCoverRequest> {
        const { requestId, usageType } = input;

        const motorCoverRequest = await MotorCoverRequest.findOne({ id: requestId });
        motorCoverRequest.usageType = usageType;

        await motorCoverRequest.save()

        return motorCoverRequest;
    }

    async getTotalAmountToBePaid(requestId: number): Promise<MotorCoverRequest> {

        const motorRequest = await MotorCoverRequest.findOne({ where: { id: requestId }, relations: ['vehicleDetails'] });

        if (!motorRequest) {
            throw new NotFoundException('Motor cover request not found!')
        }

        const isPrivate = motorRequest.vehicleDetails.MotorUsage.toLowerCase().includes("private")
        const motorCategory = motorRequest.vehicleDetails.MotorCategory;




        return motorRequest;
    }

    async setMotorVehicleDetails(input: CreateVehicleDetailDto) {
        const { requestId } = input;
        const motorRequest = await MotorCoverRequest.findOne({ id: requestId });

        if (!motorRequest) {
            throw new NotFoundException('Motor cover request not found!')
        }

        const vehicleDetail = new VehicleDetails();

        Object.assign(vehicleDetail, input);

        await vehicleDetail.save()

        motorRequest.vehicleDetails = vehicleDetail;
        motorRequest.vehicleDetailsId = vehicleDetail.id;

        return motorRequest;
    }
}