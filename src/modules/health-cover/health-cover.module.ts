import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { CreateHealthCoverEnquiryDto } from './dto/create-cover-enquiry.dto';
import { CreateHospitalDto } from './dto/create-hospitals.dto';
import { UpdateHospitalDto } from './dto/update-hospitals.dto';
import { HealthCoverEnquiry } from './models/enquiry.model';
import { Hospital } from './models/hospital.model';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([Hospital, HealthCoverEnquiry]),
      ],
      resolvers: [
        {
          DTOClass: Hospital,
          EntityClass: Hospital,
          CreateDTOClass: CreateHospitalDto,
          UpdateDTOClass: UpdateHospitalDto,
          guards: [GqlAuthGuard],
          read: { pagingStrategy: PagingStrategies.NONE },
          create: {
            decorators: [UsePermission(PermissionEnum.MANAGE_HOSPITALS)],
          },
          update: {
            decorators: [UsePermission(PermissionEnum.MANAGE_HOSPITALS)],
          },
          delete: {
            decorators: [UsePermission(PermissionEnum.MANAGE_HOSPITALS)],
          },
        },
        {
          DTOClass: HealthCoverEnquiry,
          EntityClass: HealthCoverEnquiry,
          CreateDTOClass: CreateHealthCoverEnquiryDto,
          guards: [GqlAuthGuard],
          create: {
            decorators: [
              UsePermission(PermissionEnum.MANAGE_HEALTH_COVER_ENQUIRIES),
            ],
          },
          update: {
            decorators: [
              UsePermission(PermissionEnum.MANAGE_HEALTH_COVER_ENQUIRIES),
            ],
          },
          delete: {
            decorators: [
              UsePermission(PermissionEnum.MANAGE_HEALTH_COVER_ENQUIRIES),
            ],
          },
        },
      ],
    }),
  ],
})
export class HealthCoverModule {}
