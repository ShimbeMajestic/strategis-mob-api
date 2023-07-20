import {
    NestjsQueryGraphQLModule,
    PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { CreateHealthCoverEnquiryDto } from './dto/create-cover-enquiry.dto';
import { CreateHospitalDto } from './dto/create-hospitals.dto';
import { UpdateHospitalDto } from './dto/update-hospitals.dto';
import { HealthCoverEnquiry } from './models/enquiry.model';
import { Hospital } from './models/hospital.model';
import { HealthPlan } from './models/plan.model';
import { SortDirection } from '@ptc-org/nestjs-query-core';

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [
                NestjsQueryTypeOrmModule.forFeature([
                    Hospital,
                    HealthCoverEnquiry,
                    HealthPlan,
                ]),
            ],
            resolvers: [
                {
                    DTOClass: Hospital,
                    EntityClass: Hospital,
                    CreateDTOClass: CreateHospitalDto,
                    UpdateDTOClass: UpdateHospitalDto,
                    // guards: [GqlAuthGuard],
                    read: {
                        pagingStrategy: PagingStrategies.CURSOR,
                        defaultSort: [
                            { field: 'id', direction: SortDirection.DESC },
                        ],
                    },
                    create: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_HOSPITALS),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_HOSPITALS),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_HOSPITALS),
                        ],
                    },
                },
                {
                    DTOClass: HealthCoverEnquiry,
                    EntityClass: HealthCoverEnquiry,
                    CreateDTOClass: CreateHealthCoverEnquiryDto,
                    guards: [GqlAuthGuard],
                    create: {
                        decorators: [
                            UsePermission(
                                PermissionEnum.MANAGE_HEALTH_COVER_ENQUIRIES,
                            ),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(
                                PermissionEnum.MANAGE_HEALTH_COVER_ENQUIRIES,
                            ),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(
                                PermissionEnum.MANAGE_HEALTH_COVER_ENQUIRIES,
                            ),
                        ],
                    },
                },
                {
                    DTOClass: HealthPlan,
                    EntityClass: HealthPlan,
                    guards: [GqlAuthGuard],
                    create: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_HEALTH_PLANS),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_HEALTH_PLANS),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_HEALTH_PLANS),
                        ],
                    },
                },
            ],
        }),
    ],
})
export class HealthCoverModule {}
