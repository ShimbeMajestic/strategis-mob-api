import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './models/notification.model';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Notification])],
      resolvers: [
        {
          DTOClass: Notification,
          EntityClass: Notification,
          CreateDTOClass: CreateNotificationDto,
          guards: [GqlAuthGuard],
          read: { pagingStrategy: PagingStrategies.NONE },
        },
      ],
    }),
  ],
})
export class NotificationModule {}
