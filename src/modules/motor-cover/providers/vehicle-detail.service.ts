import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { appConfig } from 'src/config/app.config';

@Injectable()
export class VehicleDetailService {
    private readonly logger = new Logger('VehicleDetailService');

    constructor(private httpService: HttpService) {}

    async getVehicleDetailsFromTira(registrationNumber: string) {
        try {
            const result = await this.httpService
                .get(
                    appConfig.tiraApiUrl +
                        `/vehicle-detail/?registrationNumber=${registrationNumber}`,
                )
                .toPromise();

            this.logger.log(
                `Result from Get vehicle details API call: ${JSON.stringify(
                    result.data,
                )}`,
            );

            if (result.status !== 200) {
                return {
                    success: false,
                    message: 'Failed to get vehicle details!',
                };
            }

            return result.data;
        } catch (error) {
            this.logger.error(error.message);

            this.logger.error(error.stack);

            return {
                success: false,
                message: 'Failed to get vehicle details from bridge server!',
            };
        }
    }

    async checkIfVehicleHasCover(
        registrationNumber: string,
        coverStartDate: Date,
    ) {
        try {
            const result = await this.httpService
                .get(
                    appConfig.tiraApiUrl +
                        `/motor/vehicle/cover?paramType=2&registrationNumber=${registrationNumber}`,
                )
                .toPromise();

            this.logger.log(
                `Result from checking vehicle cover status: ${JSON.stringify(
                    result.data,
                )}`,
            );

            if (result.status !== 200) {
                this.logger.debug(
                    `Failed to check if vehicle has cover, Registration Number: ${registrationNumber}`,
                );
                return {
                    success: false,
                    exists: false,
                    message: 'Failed to check if vehicle has cover!',
                };
            }

            const coverEndDate = new Date(
                result.data?.policy?.coverNoteEndDate,
            );

            if (
                result.data.status === 'ACTIVE' &&
                coverStartDate <= coverEndDate
            ) {
                return {
                    success: true,
                    exists: true,
                    data: result.data.policy,
                };
            } else {
                return {
                    success: true,
                    exists: false,
                    data: result.data,
                };
            }
        } catch (error) {
            this.logger.error(error.message);
            this.logger.error(error.stack);

            return {
                success: false,
                message: 'Failed to check if vehicle has cover!',
            };
        }
    }
}
