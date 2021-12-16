import { Process, Processor } from '@nestjs/bull';
import * as moment from 'moment';
import { MOTOR_COVER_JOB, MOTOR_COVER_QUEUE } from 'src/shared/sms/constants';
import * as generateUniqueId from 'generate-unique-id';
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
          'coverType',
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
        await coverRequest.save();

        const payload = this.prepareTiraRequest(coverRequest);

        await this.httpService
          .post(appConfig.tiraApiUrl, payload)
          .subscribe((response) => {
            console.log(response);
          });
      }
    } catch (error) {
      console.log(error);
      this.logger.log(error.message);
    }
  }

  prepareTiraRequest = (request: MotorCoverRequest) => {
    return {
      requestId: request.requestId,
      coverNoteStartDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
      coverNoteEndDate: moment()
        .add(request.motorCoverDuration.duration, 'days')
        .subtract(1, 'day')
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm:ss'),
      coverNoteType: 1,
      coverNoteNumber:
        'SITL-' + generateUniqueId({ length: 7, useLetters: false }), // comeback to this
      coverNoteReferenceNumber: generateUniqueId({
        length: 14,
        useLetters: false,
      }), // comeback to this
      policyNumber:
        'SITL-POL-' + generateUniqueId({ length: 7, useLetters: false }),
      covernoteDescription: request.coverType.riskName,
      operativeClause: request.motorCover.name,
      currencyCode: request.currency,
      exchangeRate: 1,
      premiumIncludingTax: request.minimumAmountIncTax,
      productCode: request.coverType.productCode,
      riskCode: request.coverType.riskCode,
      sumInsured: request.vehicleDetails.value,
      sumInsucredEquivalent: request.vehicleDetails.value,
      premiumRate: request.coverType.rate / 100,
      premiumExcludingDiscount: request.minimumAmountIncTax,
      premiumAfterDiscount: request.minimumAmountIncTax,
      premiumExcludingTaxEquivalent:
        request.minimumAmountIncTax - request.minimumAmount,
      taxCode: 'VAT-MAINLAND',
      taxRate: 0.18,
      taxAmount: request.minimumAmountIncTax - request.minimumAmount,
      isTaxExempted: 'N',
      policyHolderName: `${request.customer.firstName} ${request.customer.lastName}`,
      policyHolderBirthDate: request.customer.dob,
      policyHolderType: 1,
      policyHolderIdNumber: request.customer.identityNumber,
      policyHolderIdType: 1,
      gender: request.customer.gender.toUpperCase().substring(0, 1),
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
}
