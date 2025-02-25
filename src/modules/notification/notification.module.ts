import {
    NestjsQueryGraphQLModule,
    PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './models/notification.model';
import { SortDirection } from '@ptc-org/nestjs-query-core';

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
                    read: {
                        pagingStrategy: PagingStrategies.NONE,
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    update: { disabled: true },
                    create: { disabled: true },
                },
            ],
        }),
    ],
})
export class NotificationModule {}
