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
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TransactionStatusEnum } from 'src/modules/transactions/enums/transaction.enum';
import { MotorCoverRequestStatus } from '../enums/motor-cover-req-status.enum';
import { HttpService } from '@nestjs/axios';
import { appConfig } from 'src/config/app.config';
import { OwnerCategory } from '../enums/motor-owner-category.enum';
import { MotorUsage, MotorUsageType } from '../enums/motor-usage.enum';
import { PaymentModeEnum } from '../enums/payment-mode.enum';
import { IdType } from 'aws-sdk/clients/workdocs';
import { premiaConfig } from 'src/config/premia.config';
import { MotorPolicy } from '../models/motor-policy.model';

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
          .post(appConfig.tiraApiUrl + '/motor/policy/create', payload)
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
  async processPremiaCallback(
    job: Job<{ request: MotorCoverRequest; policy: MotorPolicy }>,
  ) {
    this.logger.verbose(
      `Processing motor cover request job ID: ${
        job.id
      }, Payload : ${JSON.stringify(job.data)}`,
    );

    const { request, policy } = job.data;

    const insuredPayload = this.prepareInsuredRequestToPremia(request);

    this.logger.log(`Request to Premia 1: ${JSON.stringify(insuredPayload)}`);

    this.httpService
      .post(premiaConfig.insuredCreationUrl, insuredPayload)
      .subscribe((response) => {
        this.logger.log(
          `Status from Premia for Insured details Postage: ${response.statusText}`,
        );

        this.logger.log(
          `Response from Premia for Insured details Postage: ${JSON.stringify(
            response.data,
          )}`,
        );
        if (response.data.P_STATUS !== 'Success') {
          throw new InternalServerErrorException(response.data);
        }

        const P_ASSR_CODE = response.data.P_ASSR_CODE;

        const policyPayload = this.preparePolicyCreationRequestToPremia(
          request,
          P_ASSR_CODE,
        );

        this.logger.log(
          `Request to Premia 2: ${JSON.stringify(policyPayload)}`,
        );

        this.httpService
          .post(premiaConfig.insuredCreationUrl, policyPayload)
          .subscribe(async (result) => {
            this.logger.log(
              `Status from Premia regarding policy creation: ${result.statusText}`,
            );

            this.logger.log(
              `Response from Premia regarding policy creation: ${JSON.stringify(
                result.data,
              )}`,
            );
            if (result.data.P_STATUS !== 'Success') {
              throw new InternalServerErrorException(result.data);
            }

            const {
              POLICY_NUMBER,
              INVOICE_NUMBER,
              INVOICE_DATE,
              TRA_SIGNATURE,
            } = result.data.P_DATA;

            policy.premiaPolicyNumber = POLICY_NUMBER;
            policy.invoiceNumber = INVOICE_NUMBER;
            policy.invoiceDate = INVOICE_DATE;
            policy.traSignature = TRA_SIGNATURE;

            await policy.save();
            return;
          });
      });

    try {
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  prepareInsuredRequestToPremia = (request: MotorCoverRequest) => {
    return {
      PCOM_ASSURED: {
        ASSR_NAME: request.customer.firstName + request.customer.lastName,
        ASSR_DOB: request.customer.dob,
        ASSR_PHONE: request.customer.phone,
        ASSR_TYPE: '01',
        ASSR_PAN_NO: request.customer.identityNumber,
        ASSR_ADDR_01: request.customer.region.name,
        ASSR_CUST_CODE: 'DC0010895',
        ASSR_CIVIL_ID: request.requestId,
        ASSR_SSN_NO: request.customer.identityNumber,
        ASSR_EMAIL_1: request.customer.email,
      },
    };
  };

  preparePolicyCreationRequestToPremia = (
    request: MotorCoverRequest,
    policyAssrCode: string,
  ) => {
    return {
      PGIT_POL_RISK_ADDL_INFO: {
        PGIT_POL_RISK_ADDL_INFO_01: [
          {
            RISKINFO: [
              {
                PRAI_EFF_FM_DT: moment(request.coverNoteStartDate)
                  .format('DD MMM YYYY')
                  .toUpperCase(),

                PRAI_EFF_TO_DT: moment(request.coverNoteEndDate)
                  .format('DD MMM YYYY')
                  .toUpperCase(),

                PRAI_RISK_ID: '1',

                PRAI_CODE_21: request.motorCover.code,

                PRAI_CODE_03:
                  request.vehicleDetails.MotorUsage === 'Private or Normal'
                    ? `00` + MotorUsage.PRIVATE
                    : `00` + MotorUsage.COMMERCIAL,

                PRAI_CODE_04: request.vehicleDetails.Make,

                PRAI_DATA_01: request.vehicleDetails.ChassisNumber,

                PRAI_NUM_09: request.vehicleDetails.SittingCapacity,

                PRAI_NUM_03: request.vehicleDetails.SittingCapacity,

                PRAI_CODE_01: request.vehicleDetails.MotorCategory,

                PRAI_NUM_01: request.vehicleDetails.YearOfManufacture,

                PRAI_DATA_05: request.requestId,

                PRAI_CODE_13: request.vehicleDetails.BodyType,

                PRAI_DATA_03: request.vehicleDetails.RegistrationNumber,

                PRAI_DATA_02: request.vehicleDetails.EngineNumber,

                PRAI_NUM_02: request.vehicleDetails.value,

                PRAI_NUM_04: '100',

                PRAI_CODE_05: request.vehicleDetails.Model,

                PRAI_PREM_FC: request.minimumAmountIncTax,
              },
            ],
          },
        ],
      },

      PGIT_POLICY: {
        POL_PROD_CODE: this.getPolicyCode(request.usageType),

        POL_CUST_CODE: 'DC0015599',

        POL_ASSR_CODE: policyAssrCode,

        POL_SRC_CODE: '',

        POL_ISSUE_DT: moment(request.updatedAt)
          .format('DD MMM YYYY')
          .toUpperCase(),

        POL_SRC_TYPE: '1',

        POL_FLEX_14: '01',

        POL_FLEX_13: 'test',

        POL_FLEX_17: this.getVehicleUsage(request.usageType),

        POL_PREM_CURR_CODE: '001',

        POL_DFLT_SI_CURR_CODE: '001',

        POL_FM_DT: moment(request.coverNoteStartDate)
          .format('DD MMM YYYY')
          .toUpperCase(),

        POL_TO_DT: moment(request.coverNoteEndDate)
          .format('DD MMM YYYY')
          .toUpperCase(),
      },
    };
  };

  getPolicyCode = (usageType: MotorUsageType) => {
    switch (usageType) {
      case MotorUsageType.COMMERCIAL_LOGISTICS:
        return '1001';

      case MotorUsageType.COMMERCIAL_PASSENGER:
        return '1006';

      case MotorUsageType.PRIVATE:
        return '1002';

      case MotorUsageType.SPECIAL_TYPE:
        return;

      default:
        return '1006';
    }
  };

  getVehicleUsage = (usageType: MotorUsageType) => {
    switch (usageType) {
      case MotorUsageType.COMMERCIAL_LOGISTICS:
        return 'COMMERCIAL';

      case MotorUsageType.COMMERCIAL_PASSENGER:
        return 'PASSENGER';

      case MotorUsageType.PRIVATE:
        return 'PRIVATE';

      case MotorUsageType.SPECIAL_TYPE:
        return 'SPECIAL TYPE';

      default:
        return 'PRIVATE';
    }
  };
}
