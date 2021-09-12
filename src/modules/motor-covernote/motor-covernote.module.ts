import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { CreateMotorCoverDurationDto } from './dtos/create-motor-cover-duration.dto';
import { CreateMotorCoverTypeDto } from './dtos/create-motor-cover-type.dto';
import { UpdateMotorCoverDurationDto } from './dtos/update-motor-cover-duration.dto';
import { UpdateMotorCoverTypeDto } from './dtos/update-cover-type.dto';
import { MotorCoverDuration } from './models/motor-cover-duration.model';
import { MotorCoverType } from './models/motor-cover-type.model';

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({

            imports: [NestjsQueryTypeOrmModule.forFeature([MotorCoverDuration, MotorCoverType])],
            dtos: [
                {
                    DTOClass: MotorCoverDuration,
                    CreateDTOClass: CreateMotorCoverDurationDto,
                    UpdateDTOClass: UpdateMotorCoverDurationDto
                }, {
                    DTOClass: MotorCoverType,
                    CreateDTOClass: CreateMotorCoverTypeDto,
                    UpdateDTOClass: UpdateMotorCoverTypeDto
                }
            ]

        }),
    ],
    providers: []
})
export class MotorCovernoteModule { }
