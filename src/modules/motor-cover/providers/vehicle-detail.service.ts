import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
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
            `/vehicle-detail?registrationNumber=${registrationNumber}`,
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

  async checkIfVehicleHasCover(registrationNumber: string) {
    try {
      const result = await this.httpService
        .get(
          appConfig.tiraApiUrl +
            `/motor/vehicle/cover?paramType=2&registrationNumber=${registrationNumber}`,
        )
        .toPromise();

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

      if (result.data.code !== 1000) {
        return {
          success: false,
          exists: false,
          data: result.data,
        };
      }

      const { coverNoteEndDate } = result.data.data;

      if (moment(new Date(coverNoteEndDate)).isAfter()) {
        return {
          success: true,
          exists: true,
          data: result.data.data,
        };
      } else {
        return {
          success: true,
          exists: false,
          data: result.data.data,
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
