import { Injectable, Logger } from "@nestjs/common";
import * as xml from 'xml';
import { tiraConfig } from "../../../config/tira.config";
import { TiraHelper } from "src/shared/tira-shared";
import { Str } from "src/shared/helpers/string.helper";
import { VehicleDetailResponse, VehicleDetailDto } from "../dtos/vehicle-detail.response";
import { VehicleDetailRequestDto } from "../dtos/vehicle-detail.request";

@Injectable()
export class VehicleDetailTransformer {

    protected readonly logger = new Logger('VehicleDetailTransformer');

    constructor(
        protected readonly tiraHelper: TiraHelper,
    ) { }

    async toXml(input: VehicleDetailRequestDto): Promise<string> {

        this.logger.debug(input);

        const msgBodyObject = {
            MotorVerificationReq: [
                {
                    VerificationHdr: [
                        { RequestId: Str.random() },
                        { CompanyCode: tiraConfig.companyCode },
                        { SystemCode: tiraConfig.systemCode },
                    ],
                },
                {
                    VerificationDtl: [
                        { MotorCategory: 1 },
                        { MotorRegistrationNumber: input.registrationNumber },
                        { MotorChassisNumber: input.chassisNumber },
                    ],
                }
            ],
        };

        const xmlPayload = xml(msgBodyObject);

        this.logger.debug(xmlPayload);

        return xmlPayload;
    }

    async fromXml(xml: string): Promise<VehicleDetailResponse> {

        this.logger.debug(xml);

        const rawDataWithEnvelope = await this.tiraHelper.xmlToJson(xml);
        const rawData = rawDataWithEnvelope['TiraMsg'];

        this.logger.debug(rawData);

        const responseHeaders = rawData['MotorVerificationRes'][0]['VerificationHdr'][0];

        const headers = {
            ResponseId: responseHeaders['ResponseId'][0],
            RequestId: responseHeaders['RequestId'][0],
            ResponseStatusCode: responseHeaders['ResponseStatusCode'][0],
            ResponseStatusDesc: responseHeaders['ResponseStatusDesc'][0],
        };

        // Success
        if (headers.ResponseStatusCode === 'TIRA001') {

            const details = rawData['MotorVerificationRes'][0]['VerificationDtl'][0];
            const data = this.parseVehicleDetails(details);

            const response = { headers, data };

            this.logger.debug(response);

            return response;
        }

        // Other Error (including TIRA007 === Not found)
        const response = { headers }

        this.logger.debug(response);

        return response;
    }

    private parseVehicleDetails(details: any): VehicleDetailDto {
        return {
            RegistrationNumber: details['RegistrationNumber'][0],

            BodyType: details['BodyType'][0],

            SittingCapacity: parseInt(details['SittingCapacity'][0], 0),

            MotorCategory: parseInt(details['MotorCategory'][0], 10),

            ChassisNumber: details['ChassisNumber'][0],

            Make: details['Make'][0],

            Model: details['Model'][0],

            ModelNumber: details['ModelNumber'][0],

            Color: details['Color'][0],

            EngineNumber: details['EngineNumber'][0],

            EngineCapacity: details['EngineCapacity'][0],

            FuelUsed: details['FuelUsed'][0],

            NumberOfAxles: parseInt(details['NumberOfAxles'][0], 10),

            AxleDistance: parseInt(details['AxleDistance'][0], 10),

            YearOfManufacture: parseInt(details['YearOfManufacture'][0], 10),

            TareWeight: parseInt(details['TareWeight'][0], 10),

            GrossWeight: parseInt(details['GrossWeight'][0], 10),

            MotorUsage: details['MotorUsage'][0],

            OwnerName: details['OwnerName'][0],

            OwnerCategory: details['OwnerCategory'][0],
        };
    }

}
