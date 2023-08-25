import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Customer } from 'src/modules/customer/models/customer.model';
import { TransactionPaymentResultDto } from 'src/modules/transactions/dtos/transaction-payment.result.dto';
import { TransactionService } from 'src/modules/transactions/providers/transaction.service';
import { GetVehicleDetailsDto } from '../dtos/get-vehicle-details.response';
import { PayMotorCoverDto } from '../dtos/pay-motor-cover.dto';
import { SetMotorUsageTypeDto } from '../dtos/set-motor-usage-type.dto';
import { SetMotorCoverDurationDto } from '../dtos/set-motorcover-duration.dto';
import { SetVehicleImagesDto } from '../dtos/set-vehicle-images.dto';
import { SetVehicleValueDto } from '../dtos/set-vehicle-value.dto';
import { CreateVehicleDetailDto } from '../dtos/vehicle-detail.dto';
import { VehicleDetailRequestDto } from '../dtos/vehicle-detail.request';
import { MotorUsageType } from '../enums/motor-usage.enum';
import { MotorCoverRequest } from '../models/motor-cover-request.model';
import { VehicleDetails } from '../models/vehicle-details.model';
import { VehicleDetailService } from './vehicle-detail.service';
import { TiraCallbackDto } from '../dtos/tira-callback.dto';
import { MotorCoverRequestStatus } from '../enums/motor-cover-req-status.enum';
import { MotorPolicy } from '../models/motor-policy.model';
import * as moment from 'moment';
import { NotificationService } from 'src/shared/notification/services/notification.service';
import { SmsService } from 'src/shared/sms/services/sms.service';
import { SetMotorCoverType } from '../dtos/set-motorcover-type.dto';
import { InjectQueue } from '@nestjs/bull';
import {
    MOTOR_COVER_JOB,
    MOTOR_COVER_QUEUE,
    PREMIA_CALLBACK_JOB,
} from 'src/shared/sms/constants';
import { Queue } from 'bull';
import { User } from 'src/modules/user/models/user.model';
import { ApprovalDto } from '../dtos/approval.dto';
import { MotorCover } from '../models/motor-cover.model';
import { Transaction } from 'src/modules/transactions/models/transaction.model';
import { Not } from 'typeorm';
import { VehiclePhoto } from '../models/vehicle-photo.model';
import { UploadsService } from 'src/shared/uploads/providers/uploads.service';
import { VehiclePhotoView } from '../enums/vehicle-photo-view.enum';
import { Str } from 'src/shared';

@Injectable()
export class MotorCovernoteService {
    private logger: Logger = new Logger(MotorCovernoteService.name);

    constructor(
        private readonly vehicleDetailService: VehicleDetailService,
        private transactionService: TransactionService,
        private notificationService: NotificationService,
        @InjectQueue(MOTOR_COVER_QUEUE)
        private readonly motorCoverQueue: Queue,
        private readonly smsService: SmsService,
        protected uploadService: UploadsService,
    ) {}

    async setMotorCoverAndDuration(
        input: SetMotorCoverDurationDto,
        customer: Customer,
    ): Promise<MotorCoverRequest> {
        const { motorCoverId, motorCoverDurationId, vehicleType } = input;

        const motorCover = await MotorCover.findOne({
            where: {
                id: motorCoverId,
            },
        });

        const motorCoverRequest = new MotorCoverRequest();
        motorCoverRequest.motorCoverId = motorCoverId;
        motorCoverRequest.customer = customer;

        if (vehicleType) {
            motorCoverRequest.vehicleType = vehicleType;
        }

        if (motorCoverDurationId)
            motorCoverRequest.motorCoverDurationId = motorCoverDurationId;

        if (motorCover && motorCover.name === 'Comprehensive')
            motorCoverRequest.requiresApproval = true;

        await motorCoverRequest.save();

        return motorCoverRequest;
    }

    async getVehicleDetails(
        input: VehicleDetailRequestDto,
    ): Promise<GetVehicleDetailsDto> {
        const { motorCoverReqId, registrationNumber, coverNoteStartDate } =
            input;

        const motorCoverRequest = await MotorCoverRequest.findOne({
            where: { id: motorCoverReqId },
        });

        if (!motorCoverRequest) {
            throw new BadRequestException('Invalid motor cover request id!');
        }

        const response = await this.vehicleDetailService.checkIfVehicleHasCover(
            registrationNumber,
        );

        if (response.success && response.exists) {
            return {
                success: false,
                activeCoverNote: true,
                message: 'Vehicle has an exisiting active cover!',
                data: null,
            };
        }

        const result =
            await this.vehicleDetailService.getVehicleDetailsFromTira(
                registrationNumber,
            );

        if (!result.success) {
            return {
                success: false,
                activeCoverNote: false,
                message: 'Vehicle Details not found from TIRA',
                data: null,
            };
        }

        const vehicleDetails = new VehicleDetails();
        Object.assign(vehicleDetails, result.data);

        await vehicleDetails.save();

        motorCoverRequest.vehicleDetails = vehicleDetails;
        motorCoverRequest.vehicleDetailsId = vehicleDetails.id;
        motorCoverRequest.coverNoteStartDate = coverNoteStartDate;

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
            where: { id: requestId },
        });
        motorCoverRequest.usageType = usageType;

        await motorCoverRequest.save();

        return motorCoverRequest;
    }

    async getTotalAmountToBePaid(
        requestId: number,
    ): Promise<MotorCoverRequest> {
        const motorRequest = await MotorCoverRequest.findOne({
            where: { id: requestId },
            relations: [
                'vehicleDetails',
                'motorCoverDuration',
                'motorCoverType',
            ],
        });

        if (!motorRequest) {
            throw new NotFoundException('Motor cover request not found!');
        }

        if (motorRequest.motorCoverType.rate > 0) {
            // Calculate short period if available
            const rate = this.getPremiumRate(
                motorRequest.motorCoverDuration.duration,
                motorRequest.motorCoverType.rate / 100,
            );

            const minimumAmount =
                rate * motorRequest.vehicleDetails.value +
                motorRequest.motorCoverType.addOnAmount;

            let calculateMinimumAmount =
                minimumAmount < motorRequest.motorCoverType.minimumAmount
                    ? motorRequest.motorCoverType.minimumAmount
                    : minimumAmount;

            if (
                motorRequest.motorCoverType.usage ===
                MotorUsageType.COMMERCIAL_PASSENGER
            ) {
                calculateMinimumAmount +=
                    motorRequest.motorCoverType.perSeatAmount *
                    motorRequest.vehicleDetails.SittingCapacity;
            }

            motorRequest.minimumAmount = parseFloat(
                calculateMinimumAmount.toFixed(2),
            );

            motorRequest.minimumAmountIncTax = parseFloat(
                (
                    motorRequest.minimumAmount * 0.18 +
                    motorRequest.minimumAmount
                ).toFixed(2),
            );
        } else {
            motorRequest.minimumAmount =
                motorRequest.motorCoverType.minimumAmount +
                motorRequest.motorCoverType.addOnAmount;

            if (
                motorRequest.motorCoverType.usage ===
                MotorUsageType.COMMERCIAL_PASSENGER
            ) {
                motorRequest.minimumAmount +=
                    motorRequest.motorCoverType.perSeatAmount *
                    motorRequest.vehicleDetails.SittingCapacity;
            }

            motorRequest.minimumAmountIncTax = parseFloat(
                (
                    motorRequest.minimumAmount * 0.18 +
                    motorRequest.minimumAmount
                ).toFixed(2),
            );
        }

        motorRequest.productCode = motorRequest.motorCoverType.productCode;
        motorRequest.riskCode = motorRequest.motorCoverType.riskCode;
        motorRequest.productName = motorRequest.motorCoverType.productName;
        motorRequest.coverNoteEndDate = moment(motorRequest.coverNoteStartDate)
            .add(motorRequest.motorCoverDuration.duration, 'days')
            .subtract(1, 'day')
            .endOf('day')
            .toDate();
        motorRequest.coverNoteNumber = 'SITL-' + Str.randomFixedInteger(7);
        motorRequest.policyNumber = 'SITL-POL-' + Str.randomFixedInteger(7);
        motorRequest.coverNoteNumber = 'SITL-' + Str.randomFixedInteger(7); // comeback to this

        await motorRequest.save();

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
        const motorRequest = await MotorCoverRequest.findOne({
            where: { id: requestId },
        });

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

        const motorRequest = await MotorCoverRequest.findOne({
            where: { id: requestId },
        });

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

    async uploadVehiclePhoto(
        motorCoverRequestId: number,
        view: string,
        uploadedFile: any,
    ) {
        const cover = await MotorCoverRequest.findOne({
            where: { id: motorCoverRequestId },
        });

        if (!cover)
            throw new NotFoundException(`Motor Cover Request Not Found`);

        // Check cover is in PENDING state
        if (cover.status !== 'PENDING')
            throw new NotFoundException(
                `Photo upload is allowed only when Request is in PENDING state`,
            );

        const upload = await this.uploadService.uploadFile(uploadedFile);

        // Check if photo view is valid enum VehiclePhotoView
        if (!Object.values(VehiclePhotoView).includes(view as VehiclePhotoView))
            throw new BadRequestException(
                `Invalid photo view. Valid values are ${Object.values(
                    VehiclePhotoView,
                ).join(', ')}`,
            );

        const vehiclePhoto = VehiclePhoto.create({
            view,
            motorCoverRequestId,
            uploadId: upload.id,
        });

        await vehiclePhoto.save();

        // Overwrite previous uploaded image for same VIEW
        VehiclePhoto.createQueryBuilder()
            .delete()
            .where({
                view,
                motorCoverRequestId,
                uploadId: Not(upload.id),
            })
            .execute();

        return upload;
    }

    async handleCallbackFromTira(input: TiraCallbackDto) {
        const {
            RequestId,
            StickerNumber,
            ResponseStatusDesc,
            ResponseStatusCode,
            CoverNoteReferenceNumber,
        } = input;

        try {
            const status = [
                'TIRA001', // success NEW, RENEW or ENDORSEMENT
                'TIRA214', // success CANCELLATION
            ].includes(ResponseStatusCode)
                ? MotorCoverRequestStatus.SUCCESS
                : MotorCoverRequestStatus.STICKER_PROCESS_FAILED;

            const request = await MotorCoverRequest.findOne({
                where: {
                    requestId: RequestId,
                },
                relations: [
                    'customer',
                    'vehicleDetails',
                    'motorCover',
                    'customer.region',
                ],
            });

            const transaction = await Transaction.findOne({
                where: {
                    reference: RequestId,
                },
            });

            if (!request) {
                return {
                    success: false,
                    message: 'Request ID not found!',
                };
            }

            request.status = MotorCoverRequestStatus.SUCCESS;
            request.statusDescription = ResponseStatusDesc;

            await request.save();

            if (status === MotorCoverRequestStatus.SUCCESS) {
                const policy = new MotorPolicy();

                policy.customerId = request.customerId;
                policy.coverNoteStartDate = request.coverNoteStartDate;
                policy.coverNoteEndDate = request.coverNoteEndDate;
                policy.motorCoverRequestId = request.id;
                policy.eSticker = StickerNumber;
                policy.coverNoteReferenceNumber = CoverNoteReferenceNumber;

                await policy.save();

                // Notify user via sms & push notification
                await this.notificationService.sendNotificationToDevice({
                    title: 'Successfully Proccessed e-Sticker',
                    body: `Successfully recieved e-Sticker from TIRA for Vehicle Registration number: ${
                        request.vehicleDetails.RegistrationNumber
                    }\nSticker number ${
                        policy.eSticker
                    }.\nCovernote reference number: ${
                        policy.coverNoteReferenceNumber
                    }.\nStart Date: ${moment(policy.coverNoteStartDate)
                        .format('DD MMM YYYY')
                        .toUpperCase()}.\nEnd Date: ${moment(
                        policy.coverNoteEndDate,
                    )
                        .format('DD MMM YYYY')
                        .toUpperCase()}`,
                    token: request.customer.token,
                });

                this.smsService.sendSms({
                    message: `Successfully recieved e-Sticker from TIRA for Vehicle Registration number: ${
                        request.vehicleDetails.RegistrationNumber
                    }\nSticker number ${
                        policy.eSticker
                    }.\nCovernote reference number: ${
                        policy.coverNoteReferenceNumber
                    }.\nStart Date: ${moment(policy.coverNoteStartDate)
                        .format('DD MMM YYYY')
                        .toUpperCase()}.\nEnd Date: ${moment(
                        policy.coverNoteEndDate,
                    )
                        .format('DD MMM YYYY')
                        .toUpperCase()}`,
                    to: request.customer.phone,
                });

                // Process callback to premia

                await this.motorCoverQueue.add(
                    PREMIA_CALLBACK_JOB,
                    { request, policy, transaction },
                    {
                        attempts: 15,
                    },
                );
            } else {
                // Notify user via sms & push notification
                await this.notificationService.sendNotificationToDevice({
                    title: 'Failed to Obtain e-Sticker',
                    body: `Failed to obtain e-Sticker for vehicle ${request.vehicleDetails.RegistrationNumber}. Reason: ${ResponseStatusDesc}`,
                    token: request.customer.token,
                });

                this.smsService.sendSms({
                    message: `Failed to obtain e-Sticker for vehicle ${request.vehicleDetails.RegistrationNumber}. Reason: ${ResponseStatusDesc}`,
                    to: request.customer.phone,
                });
            }

            return {
                success: true,
                message: 'Successfully handled callback',
            };
        } catch (error) {
            this.logger.error(error.message);

            return {
                success: false,
                message: 'Failed to handle callback',
                data: {
                    description: error.message,
                    stack: error.stack,
                },
            };
        }
    }

    async setMotorCoverType(input: SetMotorCoverType) {
        const { coverTypedId, requestId } = input;
        const foundRequest = await MotorCoverRequest.findOne({
            where: {
                id: requestId,
            },
        });

        if (!foundRequest) {
            throw new NotFoundException('Motor cover request not found!');
        }

        foundRequest.motorCoverTypeId = coverTypedId;

        await foundRequest.save();

        return foundRequest;
    }

    async approveCoverRequest(user: User, input: ApprovalDto) {
        try {
            const request = await MotorCoverRequest.findOne({
                where: { id: Number(input.requestId) },
            });

            if (!request) {
                throw new NotFoundException('Cover request not found!');
            }

            if (request.requiresApproval) {
                request.approved = input.approve;
                request.approvedBy = user;
                request.approvedAt = new Date();

                await request.save();

                if (request.approved && request.status == 'PAID') {
                    await this.motorCoverQueue.add(MOTOR_COVER_JOB, request);
                }
            }

            return {
                success: true,
                message: request.requiresApproval
                    ? 'Successfully approved cover request'
                    : 'Request does not require approval',
                data: request,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null,
            };
        }
    }

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
