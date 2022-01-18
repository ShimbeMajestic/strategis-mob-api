import { Process, Processor } from '@nestjs/bull';
import * as moment from 'moment';
import {
  MOTOR_COVER_JOB,
  MOTOR_COVER_QUEUE,
  PREMIA_CALLBACK_JOB,
} from 'src/shared/sms/constants';
import { Transaction } from 'src/modules/transactions/models/transaction.model';
import { Job } from 'bull';
import { MotorCoverRequest } from '../models/motor-cover-request.model';
import { Logger, NotFoundException } from '@nestjs/common';
import { TransactionStatusEnum } from 'src/modules/transactions/enums/transaction.enum';
import { MotorCoverRequestStatus } from '../enums/motor-cover-req-status.enum';
import { HttpService } from '@nestjs/axios';
import { appConfig } from 'src/config/app.config';
import { OwnerCategory } from '../enums/motor-owner-category.enum';
import { MotorUsage } from '../enums/motor-usage.enum';
import { PaymentModeEnum } from '../enums/payment-mode.enum';
import { IdType } from 'aws-sdk/clients/workdocs';

@Processor(MOTOR_COVER_QUEUE)
export class MotorCoverConsumer {
  protected readonly logger = new Logger(MotorCoverConsumer.name);

  constructor(private httpService: HttpService) {}

  @Process(MOTOR_COVER_JOB)
  async processMotorCoverRequest(job: Job<Transaction>) {
    this.logger.verbose(
      `Processing motor cover request job ID: ${
        job.id
      }, Payload : ${JSON.stringify(job.data)}`,
    );

    try {
      const { status, motorCoverRequestId, reference } = job.data;

      const coverRequest = await MotorCoverRequest.findOne({
        where: { id: motorCoverRequestId },
        relations: [
          'motorCover',
          'motorCoverType',
          'motorCoverDuration',
          'vehicleDetails',
          'customer',
          'customer.region',
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

        const payload = this.prepareTiraRequest(coverRequest);

        this.httpService
          .post(appConfig.tiraApiUrl, payload)
          .subscribe(async (response) => {
            if (!response.data.success) {
              this.logger.log(
                `Failed to initiate process of acquiring an esticker`,
              );

              coverRequest.status =
                MotorCoverRequestStatus.STICKER_PROCESS_FAILED;
              await coverRequest.save();

              return {
                success: false,
              };

              // Notify user, via sms & notification
            }

            this.logger.log(
              `Successfully initiated acquiring sticker from TIRA`,
            );

            coverRequest.status = MotorCoverRequestStatus.WAIT_FOR_STICKER;
            await coverRequest.save();

            return {
              success: true,
            };
            // Notify user, via sms & notification
          });
      }
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  prepareTiraRequest = (request: MotorCoverRequest) => {
    return {
      requestId: request.requestId,
      coverNoteStartDate: moment(request.coverNoteStartDate).format(
        'YYYY-MM-DDTHH:mm:ss',
      ),
      coverNoteEndDate: moment(request.coverNoteEndDate).format(
        'YYYY-MM-DDTHH:mm:ss',
      ),
      coverNoteType: 1,
      coverNoteNumber: request.coverNoteNumber,
      coverNoteReferenceNumber: request.coverNoteReferenceNumber,
      policyNumber: request.policyNumber,
      covernoteDescription: request.motorCoverType.riskName,
      operativeClause: request.motorCover.name,
      currencyCode: request.currency,
      exchangeRate: 1,
      premiumIncludingTax: request.minimumAmountIncTax,
      premiumExcludingTax: request.minimumAmount,
      productCode: request.motorCoverType.productCode,
      riskCode: request.motorCoverType.riskCode,
      sumInsured: request.vehicleDetails.value,
      sumInsuredEquivalent: request.vehicleDetails.value,
      premiumRate: request.motorCoverType.rate / 100,
      premiumExcludingDiscount: request.minimumAmount,
      premiumIncludingDiscount: request.minimumAmount,
      premiumAfterDiscount: request.minimumAmount,
      premiumExcludingTaxEquivalent: request.minimumAmount,
      discount: 0,
      taxCode: 'VAT-MAINLAND',
      taxRate: 0.18,
      taxAmount: request.minimumAmountIncTax - request.minimumAmount,
      isTaxExempted: 'N',
      policyHolderName: `${request.customer.firstName} ${request.customer.lastName}`,
      policyHolderBirthDate: request.customer.dob,
      policyHolderType: 1,
      policyHolderIdNumber: request.customer.identityNumber,
      policyHolderIdType: this.getIdTypeToTira(request.customer.identityType),
      gender: request.customer.gender.toUpperCase().substring(0, 1),
      countryCode: 'TZA',
      region: request.customer.region.name,
      district: request.customer.district ? request.customer.district : 'ilala',
      policyHolderPhoneNumber: request.customer.phone.substring(
        1,
        request.customer.phone.length,
      ),
      paymentMode: PaymentModeEnum.EFT,
      street: request.customer.district ? request.customer.district : 'ilala',
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
      commissionPaid: 0,
      commissionRate: 0,
      isFleet: 'N',
      motorUsage:
        request.vehicleDetails.MotorUsage === 'Private or Normal'
          ? MotorUsage.PRIVATE
          : MotorUsage.COMMERCIAL,
      ownerName: request.vehicleDetails.OwnerName,
      ownerCategory:
        request.vehicleDetails.OwnerCategory === 'Sole Proprietor'
          ? OwnerCategory.SOLE_PROPRIETOR
          : OwnerCategory.CORPORATE,
      ownerAddress: request.vehicleDetails.OwnerAddress,
      sittingCapacity: request.vehicleDetails.SittingCapacity,
      callbackUrl: appConfig.appCallbackUrl + '/motor-cover/callback',
    };
  };

  getIdTypeToTira(idType: IdType) {
    switch (idType) {
      case 'NIN':
        return 1;
      case 'VOTERS_REG_NUM':
        return 2;
      case 'PASSPORT_NUM':
        return 3;
      case 'TIN_NUM':
        return 6;

      default:
        return 1;
    }
  }

  @Process(PREMIA_CALLBACK_JOB)
  async processPremiaCallback(job: Job<MotorCoverRequest>) {
    this.logger.verbose(
      `Processing motor cover request job ID: ${
        job.id
      }, Payload : ${JSON.stringify(job.data)}`,
    );

    try {
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
