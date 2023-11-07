import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { MotorUsage } from '../enums/motor-usage.enum';
import { MotorCoverRequest } from '../models/motor-cover-request.model';
import { appConfig } from 'src/config/app.config';
import { OwnerCategory } from '../enums/motor-owner-category.enum';
import { PaymentModeEnum } from '../enums/payment-mode.enum';
import { MotorCoverRequestStatus } from '../enums/motor-cover-req-status.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { response } from 'express';
import { Region } from 'src/modules/lists/models/region.model';
import { District } from 'src/modules/lists/models/district.model';

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
                'customer',
                'customer.region',
                'customer.district',
            ],
            take: 10,
        });

        for (const request of requests) {
            await this.submitMotorRequest(request);
        }
    }

    async submitMotorRequest(request: MotorCoverRequest) {
        try {
            const payload = await this.prepareTiraRequest(request);

            this.httpService
                .post(appConfig.tiraApiUrl + '/motor/policy/create', payload)
                .subscribe(async (response) => {
                    if (!response.data.success) {
                        this.logger.log(
                            `Failed to initiate process of acquiring an esticker`,
                        );

                        request.status =
                            MotorCoverRequestStatus.STICKER_PROCESS_FAILED;

                        const message = JSON.stringify(
                            response?.data?.message,
                        )?.slice(0, 99);

                        request.policySubmissionStatus = 'FAILED';
                        request.policySubmissionSentAt = new Date();
                        request.policySubmissionMessage = message?.slice(0, 99);
                        await request.save();

                        return {
                            success: false,
                        };

                        // Notify user, via sms & notification
                    }

                    this.logger.log(
                        `Successfully initiated acquiring sticker from TIRA`,
                    );

                    request.status = MotorCoverRequestStatus.WAIT_FOR_STICKER;
                    request.policySubmissionStatus = 'SENT';
                    request.policySubmissionSentAt = new Date();
                    await request.save();

                    return {
                        success: true,
                    };
                    // Notify user, via sms & notification
                });
        } catch (error) {
            this.logger.debug(`Error: ${error.message}`);

            const message = error.message;

            request.policySubmissionStatus = 'ERROR';
            request.policySubmissionSentAt = new Date();
            request.policySubmissionMessage = message?.slice(0, 99);
            await request.save();
        }
    }

    async prepareTiraRequest(request: MotorCoverRequest) {
        const region = await Region.findOne({
            where: {
                id: request.customer.regionId,
            },
        });
        const district = await District.findOne({
            where: {
                id: request.customer.districtId,
            },
        });

        this.logger.log(`Region: ${region.name}`);
        this.logger.log(`District: ${district.name}`);

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
            policyHolderIdType: this.getIdTypeToTira(
                request.customer.identityType,
            ),
            gender: request.customer.gender.toUpperCase().substring(0, 1),
            countryCode: 'TZA',
            region: region?.name.trim(),
            district: district?.name.trim() ? district?.name.trim() : 'ilala',
            policyHolderPhoneNumber: request.customer.phone.substring(
                1,
                request.customer.phone.length,
            ),
            paymentMode: PaymentModeEnum.EFT,
            street: request.customer.district.name
                ? request.customer.district.name
                : 'ilala',
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
            callbackUrl: appConfig.appCallbackUrl + '/api/motor-cover/callback',
        };
    }

    getIdTypeToTira(idType: string) {
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
}
