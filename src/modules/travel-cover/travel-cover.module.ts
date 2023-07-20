import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { TransactionsModule } from '../transactions/transactions.module';
import { TravelConsumer } from './consumers/travel-cover.consumer';
import { CreateTravelPlanDto } from './dtos/create-travel-plan.dto';
import { UpdateTravelPlanDto } from './dtos/update-travel-plan.dto';
import { TravelCoverRequest } from './models/travel-cover-request.model';
import { TravelDestination } from './models/travel-destination.model';
import { TravelEntity } from './models/travel-entity.model';
import { TravelPlan } from './models/travel-plan.model';
import { TravelProduct } from './models/travel-product.model';
import { MapfreService } from './providers/mapfre.service';
import { TravelCoverService } from './providers/travel-cover.service';
import { TravelCoverResolver } from './resolvers/travel-cover.resolver';
import { SortDirection } from '@ptc-org/nestjs-query-core';

@Module({
    imports: [
        HttpModule,
        TransactionsModule,
        NestjsQueryGraphQLModule.forFeature({
            imports: [
                NestjsQueryTypeOrmModule.forFeature([
                    TravelCoverRequest,
                    TravelPlan,
                    TravelDestination,
                    TravelEntity,
                    TravelProduct,
                ]),
            ],
            resolvers: [
                {
                    DTOClass: TravelPlan,
                    EntityClass: TravelPlan,
                    CreateDTOClass: CreateTravelPlanDto,
                    UpdateDTOClass: UpdateTravelPlanDto,
                    guards: [GqlAuthGuard],
                    read: {
                        disabled: false,
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    create: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_TRAVEL_PLANS),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_TRAVEL_PLANS),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_TRAVEL_PLANS),
                        ],
                    },
                },

                {
                    DTOClass: TravelDestination,
                    EntityClass: TravelDestination,
                    guards: [GqlAuthGuard],
                    read: {
                        disabled: false,
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    create: {
                        decorators: [
                            UsePermission(
                                PermissionEnum.MANAGE_TRAVEL_DESTINATION,
                            ),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(
                                PermissionEnum.MANAGE_TRAVEL_DESTINATION,
                            ),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(
                                PermissionEnum.MANAGE_TRAVEL_DESTINATION,
                            ),
                        ],
                    },
                },
                {
                    DTOClass: TravelProduct,
                    EntityClass: TravelProduct,
                    guards: [GqlAuthGuard],
                    read: {
                        disabled: false,
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    create: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_TRAVEL_PRODUCT),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_TRAVEL_PRODUCT),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_TRAVEL_PRODUCT),
                        ],
                    },
                },

                {
                    DTOClass: TravelEntity,
                    EntityClass: TravelEntity,
                    guards: [GqlAuthGuard],
                    read: {
                        disabled: false,
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    create: {
                        decorators: [
                            UsePermission(
                                PermissionEnum.MANAGE_TRAVEL_ENTITIES,
                            ),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(
                                PermissionEnum.MANAGE_TRAVEL_ENTITIES,
                            ),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(
                                PermissionEnum.MANAGE_TRAVEL_ENTITIES,
                            ),
                        ],
                    },
                },

                {
                    DTOClass: TravelCoverRequest,
                    EntityClass: TravelCoverRequest,
                    guards: [GqlAuthGuard],
                    read: {
                        disabled: false,
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    create: { disabled: true },
                    update: { disabled: true },
                    delete: { disabled: true },
                    enableAggregate: true,
                    enableTotalCount: true,
                    enableSubscriptions: true,
                },
            ],
        }),
    ],
    providers: [
        TravelCoverService,
        TravelCoverResolver,
        MapfreService,
        TravelConsumer,
    ],
})
export class TravelCoverModule {}
