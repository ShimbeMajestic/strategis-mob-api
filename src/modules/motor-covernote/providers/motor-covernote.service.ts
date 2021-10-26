import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from 'src/modules/customer/models/customer.model';
import { Transaction } from 'src/modules/transactions/models/transaction.model';
import { GetVehicleDetailsDto } from '../dtos/get-vehicle-details.response';
import { PayMotorCoverDto } from '../dtos/pay-motor-cover.dto';
import { SetMotorUsageTypeDto } from '../dtos/set-motor-usage-type.dto';
import { SetMotorCoverDurationDto } from '../dtos/set-motorcover-duration.dto';
import { SetVehicleValueDto } from '../dtos/set-vehicle-value.dto';
import { CreateVehicleDetailDto } from '../dtos/vehicle-detail.dto';
import { VehicleDetailRequestDto } from '../dtos/vehicle-detail.request';
import { MotorCategory } from '../enums/motor-category.enum';
import { MotorCoverRequestStatus } from '../enums/motor-cover-req-status.enum';
import { MotorUsage, MotorUsageType } from '../enums/motor-usage.enum';
import { MotorCoverType } from '../models/motor-cover-type.model';
import { MotorCoverRequest } from '../models/mover-cover-req.model';
import { VehicleDetails } from '../models/vehicle-details.model';
import { VehicleDetailService } from './vehicle-detail.service';

@Injectable()
export class MotorCovernoteService {
  constructor(private readonly vehicleDetailService: VehicleDetailService) {}

  async setMotorCoverAndDuration(
    input: SetMotorCoverDurationDto,
    customer: Customer,
  ): Promise<MotorCoverRequest> {
    const { motorCoverId, motorCoverDurationId } = input;

    const motorCoverRequest = new MotorCoverRequest();
    motorCoverRequest.motorCoverId = motorCoverId;
    motorCoverRequest.customer = customer;

    if (motorCoverDurationId)
      motorCoverRequest.motorCoverDurationId = motorCoverDurationId;

    await motorCoverRequest.save();

    return motorCoverRequest;
  }

  async getVehicleDetails(
    input: VehicleDetailRequestDto,
  ): Promise<GetVehicleDetailsDto> {
    const { motorCoverReqId } = input;

    const motorCoverRequest = await MotorCoverRequest.findOne({
      id: motorCoverReqId,
    });

    if (!motorCoverRequest) {
      throw new BadRequestException('Invalid motor cover request id!');
    }

    const result = await this.vehicleDetailService.execute(input);

    if (result.headers.ResponseStatusCode !== 'TIRA001') {
      return {
        success: false,
        message: 'Vehicle Details not found from TIRA',
        data: null,
      };
    }

    const vehicleDetails = new VehicleDetails();
    Object.assign(vehicleDetails, result.data);

    await vehicleDetails.save();

    motorCoverRequest.vehicleDetails = vehicleDetails;
    motorCoverRequest.vehicleDetailsId = vehicleDetails.id;

    await motorCoverRequest.save();

    return {
      success: true,
      message: 'Successfully got vehicle details, proceed',
      data: vehicleDetails,
    };
  }

  async setMotorUsageType(
    input: SetMotorUsageTypeDto,
  ): Promise<MotorCoverRequest> {
    const { requestId, usageType } = input;

    const motorCoverRequest = await MotorCoverRequest.findOne({
      id: requestId,
    });
    motorCoverRequest.usageType = usageType;

    await motorCoverRequest.save();

    return motorCoverRequest;
  }

  async getTotalAmountToBePaid(requestId: number): Promise<MotorCoverRequest> {
    const motorRequest = await MotorCoverRequest.findOne({
      where: { id: requestId },
      relations: ['vehicleDetails'],
    });

    if (!motorRequest) {
      throw new NotFoundException('Motor cover request not found!');
    }

    if (motorRequest.usageType == MotorUsageType.PRIVATE) {
      if (
        motorRequest.vehicleDetails.MotorCategory == MotorCategory.MOTOR_VEHICLE
      ) {
        const foundCover = await MotorCoverType.findOne({
          where: {
            usage: MotorUsage.PRIVATE,
            category: MotorCategory.MOTOR_VEHICLE,
          },
        });

        if (!foundCover) {
          throw new Error('Could not find appropiate cover for motor!');
        }

        motorRequest.minimumAmount = foundCover.minimumAmount;
        motorRequest.minimumAmountIncTax =
          foundCover.minimumAmount * 0.18 + foundCover.minimumAmount;
        motorRequest.productCode = foundCover.productCode;
        motorRequest.riskCode = foundCover.riskCode;
        motorRequest.productName = foundCover.productName;
        motorRequest.riskName = foundCover.riskName;

        await motorRequest.save();
      }

      if (
        motorRequest.vehicleDetails.MotorCategory == MotorCategory.MOTOR_CYCLE
      ) {
        const foundCover = await MotorCoverType.findOne({
          where: {
            usage: MotorUsage.PRIVATE,
            category: MotorCategory.MOTOR_VEHICLE,
          },
        });

        if (!foundCover) {
          throw new Error('Could not find appropiate cover for motor!');
        }

        motorRequest.minimumAmount = foundCover.minimumAmount;
        motorRequest.minimumAmountIncTax =
          foundCover.minimumAmount * 0.18 + foundCover.minimumAmount;
        motorRequest.productCode = foundCover.productCode;
        motorRequest.riskCode = foundCover.riskCode;
        motorRequest.productName = foundCover.productName;
        motorRequest.riskName = foundCover.riskName;

        await motorRequest.save();
      }
    }

    return motorRequest;
  }

  async setMotorVehicleDetails(input: CreateVehicleDetailDto) {
    const {
      requestId,
      MotorCategory,
      RegistrationNumber,
      BodyType,
      SittingCapacity,
      ChassisNumber,
      Make,
      Model,
      ModelNumber,
      Color,
      EngineNumber,
      EngineCapacity,
      FuelUsed,
      YearOfManufacture,
      TareWeight,
      GrossWeight,
      MotorUsage,
      OwnerName,
      OwnerCategory,
      value,
    } = input;
    const motorRequest = await MotorCoverRequest.findOne({ id: requestId });

    if (!motorRequest) {
      throw new NotFoundException('Motor cover request not found!');
    }

    const vehicleDetail = new VehicleDetails();

    vehicleDetail.YearOfManufacture = YearOfManufacture;
    vehicleDetail.MotorCategory = MotorCategory;
    vehicleDetail.RegistrationNumber = RegistrationNumber;
    vehicleDetail.BodyType = BodyType;
    vehicleDetail.SittingCapacity = SittingCapacity;
    vehicleDetail.ChassisNumber = ChassisNumber;
    vehicleDetail.Make = Make;
    vehicleDetail.Model = Model;
    vehicleDetail.ModelNumber = ModelNumber;
    vehicleDetail.Color = Color;
    vehicleDetail.EngineNumber = EngineNumber;
    vehicleDetail.EngineCapacity = EngineCapacity;
    vehicleDetail.FuelUsed = FuelUsed;
    vehicleDetail.YearOfManufacture - YearOfManufacture;
    vehicleDetail.TareWeight = TareWeight;
    vehicleDetail.GrossWeight = GrossWeight;
    vehicleDetail.MotorUsage = MotorUsage;
    vehicleDetail.OwnerName = OwnerName;
    vehicleDetail.OwnerCategory = OwnerCategory;
    vehicleDetail.value = value;

    await vehicleDetail.save();

    motorRequest.vehicleDetails = vehicleDetail;
    motorRequest.vehicleDetailsId = vehicleDetail.id;

    await motorRequest.save();

    return motorRequest;
  }

  async payForMotorCover(input: PayMotorCoverDto) {
    const { requestId } = input;

    const motorRequest = await MotorCoverRequest.findOne({ id: requestId });

    if (!motorRequest) {
      throw new NotFoundException('Motor cover request not found!');
    }

    // contact payment gateway

    // Create a pending transaction

    const transaction = new Transaction();

    transaction.customerId = motorRequest.customerId;
    transaction.provider = 'SELCOM';
    transaction.requestId = motorRequest.id;
    transaction.currency = motorRequest.currency;
    transaction.amount = motorRequest.minimumAmountIncTax;
    await transaction.save();

    motorRequest.status = MotorCoverRequestStatus.WAITING_FOR_PAYMENT;

    await motorRequest.save();

    return {
      success: true,
      message: 'Successfully initiated',
      data: motorRequest,
    };
  }

  async setVehicleValue(input: SetVehicleValueDto) {
    const { value, requestId } = input;

    const motorCoverRequest = await MotorCoverRequest.findOne({
      where: { id: requestId },
      relations: ['vehicleDetails'],
    });

    if (!motorCoverRequest) {
      throw new NotFoundException('Motor cover request id not found!');
    }

    if (!motorCoverRequest.vehicleDetails) {
      throw new NotFoundException(
        'Motor cover request does not contain any vehicle set!',
      );
    }

    motorCoverRequest.vehicleDetails.value = value;
    await motorCoverRequest.vehicleDetails.save();

    return motorCoverRequest;
  }
}
