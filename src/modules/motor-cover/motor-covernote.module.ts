import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { CacheModule, Module } from '@nestjs/common';
import { CreateMotorCoverDurationDto } from './dtos/create-motor-cover-duration.dto';
import { CreateMotorCoverTypeDto } from './dtos/create-motor-cover-type.dto';
import { UpdateMotorCoverDurationDto } from './dtos/update-motor-cover-duration.dto';
import { UpdateMotorCoverTypeDto } from './dtos/update-cover-type.dto';
import { MotorCoverDuration } from './models/motor-cover-duration.model';
import { MotorCoverType } from './models/motor-cover-type.model';
import { GqlAuthGuard } from '../auth/auth.guard';
import { SortDirection } from '@nestjs-query/core';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { redisConfig } from 'src/config/redis.config';
import { TiraSharedModule } from 'src/shared/tira-shared/tira-shared.module';
import { VehicleDetailService } from './providers/vehicle-detail.service';
import { VehicleDetailTransformer } from './providers/vehicle-detail.transformer';
import { VehicleDetailResolver } from './resolvers/vehicle-detail.resolver';
import * as redisStore from 'cache-manager-redis-store';
import { MotorCover } from './models/motor-cover.model';
import { CreateMotorCoverDto } from './dtos/create-motor-cover.dto';
import { UpdateMotorCoverDto } from './dtos/update-motor-cover.dto';
import { MotorCoverRequest } from './models/mover-cover-req.model';
import { MotorCovernoteService } from './providers/motor-covernote.service';
import { MotorCovernoteResolver } from './resolvers/motor-covernote.resolver';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...redisConfig.default,
    }),
    TiraSharedModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([
          MotorCoverDuration,
          MotorCoverType,
          MotorCover,
          MotorCoverRequest,
        ]),
        TransactionsModule,
      ],
      resolvers: [
        {
          DTOClass: MotorCoverDuration,
          EntityClass: MotorCoverDuration,
          CreateDTOClass: CreateMotorCoverDurationDto,
          UpdateDTOClass: UpdateMotorCoverDurationDto,
          guards: [GqlAuthGuard],
          read: { pagingStrategy: PagingStrategies.NONE },
          create: {
            decorators: [UsePermission(PermissionEnum.MANAGE_COVER_DURATION)],
          },
          update: {
            decorators: [UsePermission(PermissionEnum.MANAGE_COVER_DURATION)],
          },
          delete: {
            decorators: [UsePermission(PermissionEnum.MANAGE_COVER_DURATION)],
          },
        },
        {
          DTOClass: MotorCoverType,
          EntityClass: MotorCoverType,
          CreateDTOClass: CreateMotorCoverTypeDto,
          UpdateDTOClass: UpdateMotorCoverTypeDto,
          guards: [GqlAuthGuard],
          // create: { disabled: true },
          update: {
            decorators: [UsePermission(PermissionEnum.MANAGE_COVER_TYPES)],
          },
          delete: {
            decorators: [UsePermission(PermissionEnum.MANAGE_COVER_TYPES)],
          },
        },
        {
          DTOClass: MotorCover,
          EntityClass: MotorCover,
          CreateDTOClass: CreateMotorCoverDto,
          UpdateDTOClass: UpdateMotorCoverDto,
          guards: [GqlAuthGuard],
          read: { pagingStrategy: PagingStrategies.NONE },
          create: {
            decorators: [UsePermission(PermissionEnum.MANAGE_COVER_TYPES)],
          },
          update: {
            decorators: [UsePermission(PermissionEnum.MANAGE_COVER_TYPES)],
          },
          delete: {
            decorators: [UsePermission(PermissionEnum.MANAGE_COVER_TYPES)],
          },
        },
        {
          DTOClass: MotorCoverRequest,
          EntityClass: MotorCoverRequest,
          guards: [GqlAuthGuard],
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
        },
      ],
    }),
  ],
  providers: [
    VehicleDetailTransformer,
    VehicleDetailService,
    VehicleDetailResolver,
    MotorCovernoteResolver,
    MotorCovernoteService,
  ],
  exports: [VehicleDetailService, MotorCovernoteService],
})
export class MotorCovernoteModule {}
