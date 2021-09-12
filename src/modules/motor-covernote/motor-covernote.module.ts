import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
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

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({

            imports: [NestjsQueryTypeOrmModule.forFeature([MotorCoverDuration, MotorCoverType])],
            resolvers: [
                {
                    DTOClass: MotorCoverDuration,
                    EntityClass: MotorCoverDuration,
                    CreateDTOClass: CreateMotorCoverDurationDto,
                    UpdateDTOClass: UpdateMotorCoverDurationDto,
                    guards: [GqlAuthGuard],

                    create: { decorators: [UsePermission(PermissionEnum.MANAGE_COVER_DURATION)] },
                    update: { decorators: [UsePermission(PermissionEnum.MANAGE_COVER_DURATION)] },
                    delete: { decorators: [UsePermission(PermissionEnum.MANAGE_COVER_DURATION)] },
                },
                {
                    DTOClass: MotorCoverType,
                    EntityClass: MotorCoverType,
                    CreateDTOClass: CreateMotorCoverTypeDto,
                    UpdateDTOClass: UpdateMotorCoverTypeDto,
                    guards: [GqlAuthGuard],
                    create: { decorators: [UsePermission(PermissionEnum.MANAGE_COVER_TYPES)] },
                    update: { decorators: [UsePermission(PermissionEnum.MANAGE_COVER_TYPES)] },
                    delete: { decorators: [UsePermission(PermissionEnum.MANAGE_COVER_TYPES)] },
                }
            ],
        }),
    ],
    providers: []
})
export class MotorCovernoteModule { }
