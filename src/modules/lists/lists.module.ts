import { SortDirection } from '@ptc-org/nestjs-query-core';
import {
    NestjsQueryGraphQLModule,
    PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { PermissionGuard } from '../permission/guards/permission.guard';
import { Country } from './models/country.model';
import { Region } from './models/region.model';
import { GeoDataService } from './providers/geodata.service';
import { ListResolver } from './resolvers/lists.resolver';
import { ListService } from './providers/list.service';

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            // import the NestjsQueryTypeOrmModule to register the entity with typeorm
            // and provide a QueryService
            imports: [NestjsQueryTypeOrmModule.forFeature([Country, Region])],
            // describe the resolvers you want to expose
            resolvers: [
                {
                    DTOClass: Country,
                    EntityClass: Country,
                    guards: [GqlAuthGuard, PermissionGuard],
                    read: {
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                        pagingStrategy: PagingStrategies.NONE,
                    },
                    create: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_SETTINGS),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_SETTINGS),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_SETTINGS),
                        ],
                    },
                },
                {
                    DTOClass: Region,
                    EntityClass: Region,
                    guards: [GqlAuthGuard, PermissionGuard],
                    read: {
                        pagingStrategy: PagingStrategies.NONE,
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    create: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_SETTINGS),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_SETTINGS),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_SETTINGS),
                        ],
                    },
                },
            ],
        }),
    ],
    providers: [GeoDataService, ListResolver, ListService],
})
export class ListsModule {}
