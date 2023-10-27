import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListService } from '../providers/list.service';
import { District } from '../models/district.model';

@Resolver()
export class ListResolver {
    constructor(private readonly listService: ListService) {}

    @Query(() => [District])
    getDistricts(@Args('regionId') regionId: number): Promise<District[]> {
        return this.listService.getRegionsDistrict(regionId);
    }
}
