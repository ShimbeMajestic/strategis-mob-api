import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Region } from '../models/region.model';
import { District } from '../models/district.model';

@Injectable()
export class ListService {
    private readonly logger = new Logger(ListService.name);
    async getRegionsDistrict(regionId: number): Promise<District[]> {
        const region = await Region.findOne({
            where: {
                id: regionId,
            },
        });

        if (!region) {
            throw new BadRequestException('the region provided does not exist');
        }

        const districts = await District.find({
            where: {
                regionId: region.id,
            },
        });

        return districts;
    }
}
