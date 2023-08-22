import { SortDirection } from '@ptc-org/nestjs-query-core';
import {
    NestjsQueryGraphQLModule,
    PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from './decorators/permission.decorator';
import { PermissionEnum } from './enums/permission.enum';
import { PermissionGuard } from './guards/permission.guard';
import { Permission } from './models/permission.model';
import { Role } from './models/role.model';
import { PermissionService } from './providers/permission.service';
import { CreateRoleInput } from './dtos/create-role.input';
import { RoleResolver } from './resolvers/role.resolver';

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            // import the NestjsQueryTypeOrmModule to register the entity with typeorm
            // and provide a QueryService
            imports: [NestjsQueryTypeOrmModule.forFeature([Permission, Role])],
            // describe the resolvers you want to expose
            resolvers: [
                {
                    DTOClass: Permission,
                    EntityClass: Permission,
                    guards: [GqlAuthGuard, PermissionGuard],
                    read: {
                        defaultSort: [
                            { field: 'id', direction: SortDirection.DESC },
                        ],
                        decorators: [
                            UsePermission(PermissionEnum.VIEW_PERMISSIONS),
                        ],
                        pagingStrategy: PagingStrategies.NONE,
                    },
                    create: { disabled: true },
                    update: { disabled: true },
                    delete: { disabled: true },
                },
                {
                    DTOClass: Role,
                    EntityClass: Role,
                    CreateDTOClass: CreateRoleInput,
                    guards: [GqlAuthGuard, PermissionGuard],
                    read: {
                        defaultSort: [
                            { field: 'id', direction: SortDirection.DESC },
                        ],
                        decorators: [UsePermission(PermissionEnum.VIEW_ROLES)],
                        pagingStrategy: PagingStrategies.NONE,
                    },
                    create: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_ROLES),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_ROLES),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_ROLES),
                        ],
                    },
                },
            ],
        }),
    ],
    providers: [PermissionGuard, PermissionService, RoleResolver],
    exports: [PermissionGuard],
})
export class PermissionModule {}
