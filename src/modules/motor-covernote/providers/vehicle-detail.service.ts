import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { TiraClient, TiraSigner } from "src/shared/tira-shared";
import { tiraConfig } from "../../../config/tira.config";
import { VehicleDetailRequestDto } from "../dtos/vehicle-detail.request";
import { VehicleDetailResponse } from "../dtos/vehicle-detail.response";
import { VehicleDetailTransformer } from "./vehicle-detail.transformer";

@Injectable()
export class VehicleDetailService {

    private readonly logger = new Logger('VehicleDetailService');

    constructor(
        protected readonly transformer: VehicleDetailTransformer,
        protected readonly tiraSigner: TiraSigner,
        protected readonly tiraClient: TiraClient,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async execute(input: VehicleDetailRequestDto): Promise<VehicleDetailResponse> {

        const cacheKey = input.registrationNumber
            ? `vehicle-details:registration:${input.registrationNumber}`
            : `vehicle-details:chassis-no:${input.chassisNumber}`;

        const result: VehicleDetailResponse = await this.cacheManager
            .wrap(
                cacheKey,
                () => {
                    return this._execute(input);
                },
                {
                    ttl: (response) => {
                        const aMonth = 60 * 60 * 24 * 7;
                        return (response.data) ? aMonth : 1; // only cache successful requests
                    }
                },
            );

        return result;
    }

    protected async _execute(input: VehicleDetailRequestDto): Promise<VehicleDetailResponse> {

        const xmlMessage = await this.transformer.toXml(input);

        const url = new URL(
            tiraConfig.endpoints.vehicleDetailsUrl,
            tiraConfig.endpoints.baseUrl
        ).href

        const rawResponse = await this.tiraClient.call(url, xmlMessage);

        const response = await this.transformer.fromXml(rawResponse);

        return response;
    }
}
