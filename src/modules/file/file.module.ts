import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { File } from './models/file.model';
import { FilesController } from './files.controller';
import { SortDirection } from '@nestjs-query/core';
import { PermissionGuard } from '../permission/guards/permission.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { FilesService } from './providers/files.service';
import { FileResolver } from './resolver/file.resolver';
import { FileLoader } from './dataloaders/file.loader';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([File])],
      resolvers: [
        {
          DTOClass: File,
          EntityClass: File,
          guards: [GqlAuthGuard, PermissionGuard],
          read: {
            defaultSort: [
              {
                field: 'id',
                direction: SortDirection.DESC,
              },
            ],
            decorators: [UsePermission(PermissionEnum.VIEW_PRODUCTS)],
          },
          create: {
            decorators: [UsePermission(PermissionEnum.MANAGE_PRODUCTS)],
          },
          update: {
            decorators: [UsePermission(PermissionEnum.MANAGE_PRODUCTS)],
          },
          delete: {
            decorators: [UsePermission(PermissionEnum.MANAGE_PRODUCTS)],
          },
        },
      ],
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, FileResolver, FileLoader],
  exports: [FileLoader],
})
export class FileModule {}
