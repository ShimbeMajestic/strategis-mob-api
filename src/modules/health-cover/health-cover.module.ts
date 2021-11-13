import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { CreateHospitalDto } from './dto/create-hospitals.dto';
import { UpdateHospitalDto } from './dto/update-hospitals.dto';
import { Hospitals } from './models/hospitals.model';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Hospitals])],
      resolvers: [
        {
          DTOClass: Hospitals,
          EntityClass: Hospitals,
          CreateDTOClass: CreateHospitalDto,
          UpdateDTOClass: UpdateHospitalDto,
          guards: [GqlAuthGuard],
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
