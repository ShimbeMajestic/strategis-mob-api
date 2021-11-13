import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { CreateHospitalDto } from './dto/create-hospitals.dto';
import { UpdateHospitalDto } from './dto/update-hospitals.dto';
import { Hospital } from './models/hospital.model';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Hospital])],
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
      ],
    }),
  ],
})
export class HealthCoverModule {}
