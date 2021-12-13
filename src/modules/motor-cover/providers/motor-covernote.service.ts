import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';
import { Customer } from 'src/modules/customer/models/customer.model';
import { TransactionPaymentResultDto } from 'src/modules/transactions/dtos/transaction-payment.result.dto';
import { TransactionStatusEnum } from 'src/modules/transactions/enums/transaction.enum';
import { Transaction } from 'src/modules/transactions/models/transaction.model';
import { TransactionService } from 'src/modules/transactions/providers/transaction.service';
import { GetVehicleDetailsDto } from '../dtos/get-vehicle-details.response';
import { PayMotorCoverDto } from '../dtos/pay-motor-cover.dto';
import { SetMotorUsageTypeDto } from '../dtos/set-motor-usage-type.dto';
import { SetMotorCoverDurationDto } from '../dtos/set-motorcover-duration.dto';
import { SetVehicleImagesDto } from '../dtos/set-vehicle-images.dto';
import { SetVehicleValueDto } from '../dtos/set-vehicle-value.dto';
import { CreateVehicleDetailDto } from '../dtos/vehicle-detail.dto';
import { VehicleDetailRequestDto } from '../dtos/vehicle-detail.request';
import { MotorCategory } from '../enums/motor-category.enum';
import { MotorCoverRequestStatus } from '../enums/motor-cover-req-status.enum';
import { MotorUsage, MotorUsageType } from '../enums/motor-usage.enum';
import { MotorCoverType } from '../models/motor-cover-type.model';
import { MotorCoverRequest } from '../models/motor-cover-request.model';
import { VehicleDetails } from '../models/vehicle-details.model';
import { VehicleDetailService } from './vehicle-detail.service';
import { appConfig } from 'src/config/app.config';
import { HttpService } from '@nestjs/axios';
import { Process } from '@nestjs/bull';
import { MOTOR_COVER_JOB } from 'src/shared/sms/constants';
import * as generateUniqueId from 'generate-unique-id';
import { Job, Queue } from 'bull';

@Injectable()
export class MotorCovernoteService {
  private logger: Logger = new Logger(MotorCovernoteService.name);

  constructor(
    private readonly vehicleDetailService: VehicleDetailService,
    private transactionService: TransactionService,
    private httpService: HttpService,
  ) {}

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
      relations: [
        'vehicleDetails',
        'motorCover',
        'motorCoverDuration',
        'motorCover.types',
      ],
    });

    if (!motorRequest) {
      throw new NotFoundException('Motor cover request not found!');
    }

    if (motorRequest.usageType === MotorUsageType.PRIVATE) {
      const foundCover = motorRequest.motorCover.types.find(
        (cover) =>
          cover.usage === 1 &&
          cover.category === motorRequest.vehicleDetails.MotorCategory,
      );

      if (!foundCover) {
        throw new BadRequestException('No cover fits the description!');
      }

      // Find out if cover is comprehensive or third part fire and theft
      if (foundCover.rate > 0) {
        // Calculate short period if available
        const rate = this.getPremiumRate(
          motorRequest.motorCoverDuration.duration,
          foundCover.rate / 100,
        );

        const minimumAmount = rate * motorRequest.vehicleDetails.value;

        motorRequest.minimumAmount =
          minimumAmount < foundCover.minimumAmount
            ? foundCover.minimumAmount
            : minimumAmount;

        motorRequest.minimumAmountIncTax =
          motorRequest.minimumAmount * 0.18 + motorRequest.minimumAmount;
      } else {
        motorRequest.minimumAmount = foundCover.minimumAmount;
        motorRequest.minimumAmountIncTax =
          foundCover.minimumAmount * 0.18 + foundCover.minimumAmount;
      }

      motorRequest.productCode = foundCover.productCode;
      motorRequest.riskCode = foundCover.riskCode;
      motorRequest.productName = foundCover.productName;

      motorRequest.riskName = foundCover.riskName;

      await motorRequest.save();
    }

    return motorRequest;
  }

  async getComprehensiveAmount() {}

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

  async payForMotorCover(
    input: PayMotorCoverDto,
    customer: Customer,
  ): Promise<TransactionPaymentResultDto> {
    const { requestId, email } = input;

    const motorRequest = await MotorCoverRequest.findOne({ id: requestId });

    if (!motorRequest) {
      throw new NotFoundException('Motor cover request not found!');
    }

    return this.transactionService.payForMotorCover(
      motorRequest,
      customer,
      email,
    );
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

  async setVehicleImages(input: SetVehicleImagesDto) {
    const {
      frontViewImageUrl,
      bonnetViewImageUrl,
      backViewImageUrl,
      rightSideViewImageUrl,
      leftSideViewImageUrl,
      requestId,
    } = input;

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

    motorCoverRequest.vehicleDetails.bonnetViewImageUrl = bonnetViewImageUrl;
    motorCoverRequest.vehicleDetails.frontViewImageUrl = frontViewImageUrl;
    motorCoverRequest.vehicleDetails.backViewImageUrl = backViewImageUrl;
    motorCoverRequest.vehicleDetails.rightSideViewImageUrl =
      rightSideViewImageUrl;
    motorCoverRequest.vehicleDetails.leftSideViewImageUrl =
      leftSideViewImageUrl;

    await motorCoverRequest.vehicleDetails.save();

    return motorCoverRequest;
  }

  @Process(MOTOR_COVER_JOB)
  async processMotorCoverRequest(job: Job<Transaction>) {
    const data = Object.assign(new Transaction(), job.data);

    const { status, motorCoverRequestId, reference } = data;

    const coverRequest = await MotorCoverRequest.findOne({
      where: { id: motorCoverRequestId },
      relations: [
        'motorCover',
        'motorCoverType',
        'motorCoverDuration',
        'vehicleDetails',
        'customer',
      ],
    });

    if (!coverRequest) {
      throw new NotFoundException('Motor cover request not found!');
    }

    if (status === TransactionStatusEnum.FAILED) {
      coverRequest.status = MotorCoverRequestStatus.PAYMENT_FAILED;

      // Notify user of cover status

      await coverRequest.save();
    }

    if (status === TransactionStatusEnum.SUCCESS) {
      coverRequest.status = MotorCoverRequestStatus.PAID;
      coverRequest.requestId = reference;
      await coverRequest.save();

      const payload = this.prepareTiraRequest(coverRequest);

      await this.httpService
        .post(appConfig.tiraApiUrl, payload)
        .subscribe((response) => {
          console.log(response);
        });
    }
  }

  prepareTiraRequest = (request: MotorCoverRequest) => {
    return {
      requestId: request.requestId,
      coverNoteStartDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
      coverNoteEndDate: moment()
        .add(request.motorCoverDuration.duration, 'days')
        .format('YYYY-MM-DDTHH:mm:ss'),
      coverNoteType: 1,
      coverNoteNumber:
        'SITL-' + generateUniqueId({ length: 7, useLetters: false }), // comeback to this
      coverNoteReferenceNumber: generateUniqueId({
        length: 14,
        useLetters: false,
      }), // comeback to this
      covernoteDescription: request.coverType.riskName,
      operativeClause: request.motorCover.name,
      currencyCode: request.currency,
      exchangeRate: 1,
      premiumIncludingTax: request.minimumAmountIncTax,
      productCode: request.coverType.productCode,
      riskCode: request.coverType.riskCode,
      sumInsured: request.vehicleDetails.value,
      sumInsucredEquivalent: request.vehicleDetails.value,
      premiumRate: 0.035,
      premiumExcludingDiscount: request.minimumAmountIncTax,
      premiumAfterDiscount: request.minimumAmountIncTax,
      taxCode: 'VAT-MAINLAND',
      taxRate: 0.18,
      taxAmount: request.minimumAmountIncTax - request.minimumAmount,
      isTaxExempted: 'N',
      policyHolderName: `${request.customer.firstName} ${request.customer.lastName}`,
      policyHolderBirthDate: request.customer.dob,
      policyHolderType: 1,
      policyHolderIdNumber: request.customer.identityNumber,
      policyHolderIdType: 1,
      gender: request.customer.gender,
      countryCode: 'TZA',
      region: request.customer.region.name,
      district: request.customer.district,
      policyHolderPhoneNumber: request.customer.phone,
      street: request.customer.district,
      emailAddress: request.customer.email,
      motorCategory: request.vehicleDetails.MotorCategory,
      registrationNumber: request.vehicleDetails.RegistrationNumber,
      bodyType: request.vehicleDetails.BodyType,
      chassisNumber: request.vehicleDetails.ChassisNumber,
      make: request.vehicleDetails.Make,
      model: request.vehicleDetails.Model,
      modelNumber: request.vehicleDetails.ModelNumber,
      color: request.vehicleDetails.Color,
      engineNumber: request.vehicleDetails.EngineNumber,
      engineCapacity: request.vehicleDetails.EngineCapacity,
      fuelUsed: request.vehicleDetails.FuelUsed,
      yearOfManufacture: request.vehicleDetails.YearOfManufacture,
      tareWeight: request.vehicleDetails.TareWeight,
      grossWeight: request.vehicleDetails.GrossWeight,
      motorUsage: request.vehicleDetails.MotorUsage,
      ownerName: request.vehicleDetails.OwnerName,
      ownerCategory: request.vehicleDetails.OwnerCategory,
      ownerAddress: request.vehicleDetails.OwnerAddress,
      sittingCapacity: request.vehicleDetails.SittingCapacity,
      callbackUrl: appConfig.appCallbackUrl + '/motor-cover/callback',
    };
  };

  private getPremiumRate = (duration: number, premiumRate: number) => {
    let shortPeriodRate = 1;
    if (duration >= 270) {
      shortPeriodRate = 1;
    } else if (duration >= 180) {
      shortPeriodRate = 0.85;
    } else if (duration >= 90) {
      shortPeriodRate = 0.7;
    } else if (duration >= 30) {
      shortPeriodRate = 0.4;
    } else {
      shortPeriodRate = 0.2;
    }

    this.logger.log(
      `Premium duration: ${duration} days, PremiumRate: ${premiumRate}, Short Period Rate: ${shortPeriodRate}`,
    );

    return premiumRate === null ? null : premiumRate / shortPeriodRate;
  };
}
