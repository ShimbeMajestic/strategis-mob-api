import {
    NestjsQueryGraphQLModule,
    PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { CreateMotorCoverDurationDto } from './dtos/create-motor-cover-duration.dto';
import { CreateMotorCoverTypeDto } from './dtos/create-motor-cover-type.dto';
import { UpdateMotorCoverDurationDto } from './dtos/update-motor-cover-duration.dto';
import { UpdateMotorCoverTypeDto } from './dtos/update-cover-type.dto';
import { MotorCoverDuration } from './models/motor-cover-duration.model';
import { MotorCoverType } from './models/motor-cover-type.model';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { VehicleDetailService } from './providers/vehicle-detail.service';
import { MotorCover } from './models/motor-cover.model';
import { CreateMotorCoverDto } from './dtos/create-motor-cover.dto';
import { UpdateMotorCoverDto } from './dtos/update-motor-cover.dto';
import { MotorCoverRequest } from './models/motor-cover-request.model';
import { MotorCovernoteService } from './providers/motor-covernote.service';
import { MotorCovernoteResolver } from './resolvers/motor-covernote.resolver';
import { TransactionsModule } from '../transactions/transactions.module';
import { MotorPolicy } from './models/motor-policy.model';
import { HttpModule } from '@nestjs/axios';
import { MotorCoverConsumer } from './consumers/motor-cover.consumer';
import { MotorCoverController } from './controllers/motor-cover.controller';
import { SharedModule } from 'src/shared/shared.module';
import { SortDirection } from '@ptc-org/nestjs-query-core';
import { VehiclePhoto } from './models/vehicle-photo.model';
import { Upload } from 'src/shared/uploads/models/upload.model';
import { MotorCoverNoteScheduler } from './providers/motor-covernote-scheduler.service';
import { PremiaDataProcessor } from './providers/premia-api-data-processor';

@Module({
    imports: [
        HttpModule,
        SharedModule,
        NestjsQueryGraphQLModule.forFeature({
            imports: [
                NestjsQueryTypeOrmModule.forFeature([
                    MotorCoverDuration,
                    MotorCoverType,
                    MotorCover,
                    MotorCoverRequest,
                    MotorPolicy,
                    VehiclePhoto,
                ]),
                TransactionsModule,
            ],
            dtos: [],
            resolvers: [
                {
                    DTOClass: VehiclePhoto,
                    EntityClass: VehiclePhoto,
                    read: { disabled: true },
                    create: { disabled: true },
                    update: { disabled: true },
                    delete: { disabled: true },
                },
                {
                    DTOClass: MotorCoverDuration,
                    EntityClass: MotorCoverDuration,
                    CreateDTOClass: CreateMotorCoverDurationDto,
                    UpdateDTOClass: UpdateMotorCoverDurationDto,
                    guards: [GqlAuthGuard],
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
                            UsePermission(PermissionEnum.MANAGE_COVER_DURATION),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_COVER_DURATION),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_COVER_DURATION),
                        ],
                    },
                },
                {
                    DTOClass: MotorCoverType,
                    EntityClass: MotorCoverType,
                    CreateDTOClass: CreateMotorCoverTypeDto,
                    UpdateDTOClass: UpdateMotorCoverTypeDto,
                    guards: [GqlAuthGuard],
                    read: {
                        pagingStrategy: PagingStrategies.NONE,
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    // create: { disabled: true },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_COVER_TYPES),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_COVER_TYPES),
                        ],
                    },
                },
                {
                    DTOClass: MotorCover,
                    EntityClass: MotorCover,
                    CreateDTOClass: CreateMotorCoverDto,
                    UpdateDTOClass: UpdateMotorCoverDto,
                    guards: [GqlAuthGuard],
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
                            UsePermission(PermissionEnum.MANAGE_COVER_TYPES),
                        ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_COVER_TYPES),
                        ],
                    },
                    delete: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_COVER_TYPES),
                        ],
                    },
                },
                {
                    DTOClass: MotorCoverRequest,
                    EntityClass: MotorCoverRequest,
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
                {
                    DTOClass: MotorPolicy,
                    EntityClass: MotorPolicy,
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
    controllers: [MotorCoverController],
    providers: [
        VehicleDetailService,
        MotorCovernoteResolver,
        MotorCovernoteService,
        MotorCoverConsumer,
        MotorCoverNoteScheduler,
        PremiaDataProcessor,
    ],
    exports: [VehicleDetailService, MotorCovernoteService],
})
export class MotorCovernoteModule {}
