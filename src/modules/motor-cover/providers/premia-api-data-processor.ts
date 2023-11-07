import { HttpService } from '@nestjs/axios';
import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import * as moment from 'moment';
import { MotorUsage, MotorUsageType } from '../enums/motor-usage.enum';
import { MotorCoverRequest } from '../models/motor-cover-request.model';
import { appConfig } from 'src/config/app.config';
import { OwnerCategory } from '../enums/motor-owner-category.enum';
import { PaymentModeEnum } from '../enums/payment-mode.enum';
import { MotorCoverRequestStatus } from '../enums/motor-cover-req-status.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { response } from 'express';
import { Region } from 'src/modules/lists/models/region.model';
import { District } from 'src/modules/lists/models/district.model';
import { premiaConfig } from 'src/config/premia.config';
import { MotorPolicy } from '../models/motor-policy.model';
import { In } from 'typeorm';

@Injectable()
export class PremiaDataProcessor {
    protected readonly logger = new Logger(PremiaDataProcessor.name);
    constructor(private readonly httpService: HttpService) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    async postToPremia() {
        const requests = await MotorCoverRequest.find({
            where: {
                policySubmissionStatus: 'PENDING',
                status: MotorCoverRequestStatus.PAID,
            },
            order: { id: 'DESC' },
            relations: [
                'motorCover',
                'motorCoverType',
                'motorCoverDuration',
                'vehicleDetails',
                'motorPolicy',
                'customer',
                'customer.region',
                'customer.district',
                'transactions',
            ],
            take: 10,
        });

        for (const request of requests) {
            await this.processToPremia(request);
        }
    }

    async processToPremia(request: MotorCoverRequest) {
        try {
            request.policySubmissionStatus = 'PROCESSING';
            await request.save();

            const insuredPayload = this.prepareInsuredRequestToPremia(request);

            this.logger.log(
                `Request to Premia 1: ${JSON.stringify(insuredPayload)}`,
            );

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
                        request.policySubmissionStatus = 'FAILED';
                        request.save();
                        throw new InternalServerErrorException(response.data);
                    }

                    const P_ASSR_CODE = response.data.P_ASSR_CODE;

                    const policyPayload =
                        this.preparePolicyCreationRequestToPremia(
                            request,
                            request.motorPolicy.eSticker,
                            request.motorPolicy.coverNoteReferenceNumber,
                            P_ASSR_CODE,
                            request.transactions[0].operatorReferenceId,
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
                                request.policySubmissionStatus = 'FAILED';
                                await request.save();
                                throw new InternalServerErrorException(
                                    result.data,
                                );
                            }

                            const {
                                POLICY_NUMBER,
                                INVOICE_NUMBER,
                                INVOICE_DATE,
                                TRA_SIGNATURE,
                            } = result.data.P_DATA;

                            request.policySubmissionStatus = 'PROCESSED';
                            request.policySubmissionSentAt = new Date();
                            request.policySubmissionMessage =
                                result.data?.message;
                            request.motorPolicy.premiaPolicyNumber =
                                POLICY_NUMBER;
                            request.motorPolicy.invoiceNumber = INVOICE_NUMBER;
                            request.motorPolicy.invoiceDate = INVOICE_DATE;
                            request.motorPolicy.traSignature = TRA_SIGNATURE;

                            await request.save();
                            await request.motorPolicy.save();
                            return;
                        });
                });
        } catch (error) {
            this.logger.error(error.message);

            const message =
                error.message +
                ': ' +
                JSON.stringify(error?.result?.data?.message)?.slice(0, 99);
            request.policySubmissionStatus = 'PROCESSED';
            request.policySubmissionSentAt = new Date();
            request.policySubmissionMessage = message?.slice(0, 99);
            await request.save();
        }
    }

    prepareInsuredRequestToPremia = (request: MotorCoverRequest) => {
        return {
            PCOM_ASSURED: {
                ASSR_NAME:
                    request.customer.firstName + request.customer.lastName,
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
        stickerNumber: string,
        coverNoteReferenceNumber: string,
        policyAssrCode: string,
        reference: string,
    ) => {
        return {
            PGIT_POL_RISK_ADDL_INFO: {
                PGIT_POL_RISK_ADDL_INFO_01: [
                    {
                        RISKINFO: [
                            {
                                PRAI_EFF_FM_DT: moment(
                                    request.coverNoteStartDate,
                                )
                                    .format('DD MMM YYYY')
                                    .toUpperCase(),

                                PRAI_EFF_TO_DT: moment(request.coverNoteEndDate)
                                    .format('DD MMM YYYY')
                                    .toUpperCase(),

                                PRAI_RISK_ID: '1',

                                PRAI_CODE_21: request.motorCover.code,

                                PRAI_CODE_03:
                                    request.vehicleDetails.MotorUsage ===
                                    'Private or Normal'
                                        ? `00` + MotorUsage.PRIVATE
                                        : `00` + MotorUsage.COMMERCIAL,

                                PRAI_CODE_04: request.vehicleDetails.Make,

                                PRAI_DATA_01:
                                    request.vehicleDetails.ChassisNumber,

                                PRAI_NUM_09:
                                    request.vehicleDetails.SittingCapacity,

                                PRAI_NUM_03: coverNoteReferenceNumber,

                                PRAI_CODE_01:
                                    request.vehicleDetails.MotorCategory,

                                PRAI_NUM_01:
                                    request.vehicleDetails.YearOfManufacture,

                                PRAI_DATA_05: stickerNumber,

                                PRAI_CODE_13: request.vehicleDetails.BodyType,

                                PRAI_DATA_03:
                                    request.vehicleDetails.RegistrationNumber,

                                PRAI_DATA_02:
                                    request.vehicleDetails.EngineNumber,

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
                POL_DIVN_CODE: '100',

                POL_PROD_CODE: this.getPolicyCode(request.usageType),

                POL_CUST_CODE: premiaConfig.policyCustomerCode,

                POL_ASSR_CODE: policyAssrCode,

                POL_SRC_CODE: 'Mobile Application',

                POL_ISSUE_DT: moment(request.updatedAt)
                    .format('DD MMM YYYY')
                    .toUpperCase(),

                POL_SRC_TYPE: '5',

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
            RECEIPT: {
                RECEIPT_MODE: 'BANK',
                BANK_CODE: premiaConfig.bankDetails.code,
                BANK_NAME: premiaConfig.bankDetails.name,
                RECEIPT_REF_NO: reference,
            },
        };
    };

    getPolicyCode = (usageType: MotorUsageType) => {
        switch (usageType) {
            case MotorUsageType.GENERAL_GOODS:
                return '1001';

            case MotorUsageType.TRAILERS:
                return '1001';

            case MotorUsageType.TANKERS:
                return '10001';

            case MotorUsageType.PASSENGER_CARRYING:
                return '1006';

            case MotorUsageType.PRIVATE_VEHICLE:
                return '1002';

            case MotorUsageType.MOTOR_CYCLE:
                return '1002';

            case MotorUsageType.SPECIAL_TYPE:
                return;

            default:
                return '1006';
        }
    };

    getVehicleUsage = (usageType: MotorUsageType) => {
        switch (usageType) {
            case MotorUsageType.GENERAL_GOODS:
                return 'COMMERCIAL';

            case MotorUsageType.TANKERS:
                return 'COMMERCIAL';

            case MotorUsageType.TRAILERS:
                return 'COMMERCIAL';

            case MotorUsageType.PASSENGER_CARRYING:
                return 'PASSENGER';

            case MotorUsageType.PRIVATE_VEHICLE:
                return 'PRIVATE';

            case MotorUsageType.MOTOR_CYCLE:
                return 'PRIVATE';

            case MotorUsageType.SPECIAL_TYPE:
                return 'SPECIAL TYPE';

            default:
                return 'PRIVATE';
        }
    };
}
