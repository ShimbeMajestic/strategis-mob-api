import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { redisConfig } from 'src/config/redis.config';
import {
    MOTOR_COVER_QUEUE,
    TRANSACTION_CALLBACK_QUEUE,
    TRAVEL_COVER_QUEUE,
} from 'src/shared/sms/constants';
import { GqlAuthGuard } from '../auth/auth.guard';
import { TransactionController } from './controllers/transaction.controller';
import { Transaction } from './models/transaction.model';
import { TransactionConsumer } from './consumers/transaction.consumer';
import { TransactionService } from './providers/transaction.service';
import { SharedModule } from 'src/shared/shared.module';
import { SortDirection } from '@ptc-org/nestjs-query-core';
import { TransactionResolver } from './resolvers/transaction.resolver';

@Module({
    imports: [
        HttpModule,
        SharedModule,
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([Transaction])],
            resolvers: [
                {
                    DTOClass: Transaction,
                    EntityClass: Transaction,
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
        BullModule.registerQueue({
            name: TRANSACTION_CALLBACK_QUEUE,
            redis: redisConfig.bullQueue,
            defaultJobOptions: {
                lifo: true,
                attempts: 15,
            },
        }),
        BullModule.registerQueue({
            name: MOTOR_COVER_QUEUE,
            redis: redisConfig.bullQueue,
            defaultJobOptions: {
                lifo: true,
                attempts: 15,
            },
        }),
        BullModule.registerQueue({
            name: TRAVEL_COVER_QUEUE,
            redis: redisConfig.bullQueue,
            defaultJobOptions: {
                lifo: true,
                attempts: 15,
            },
        }),
    ],
    controllers: [TransactionController],
    providers: [TransactionConsumer, TransactionService, TransactionResolver],
    exports: [TransactionService, BullModule],
})
export class TransactionsModule {}
