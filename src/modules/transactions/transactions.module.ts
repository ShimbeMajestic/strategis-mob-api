import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { redisConfig } from 'src/config/redis.config';
import {
  MOTOR_COVER_QUEUE,
  TRANSACTION_CALLBACK_QUEUE,
} from 'src/shared/sms/constants';
import { GqlAuthGuard } from '../auth/auth.guard';
import { MotorCovernoteModule } from '../motor-cover/motor-covernote.module';
import { TransactionController } from './controllers/transaction.controller';
import { Transaction } from './models/transaction.model';
import { TransactionService } from './providers/transaction.service';

@Module({
  imports: [
    HttpModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Transaction])],
      resolvers: [
        {
          DTOClass: Transaction,
          EntityClass: Transaction,
          guards: [GqlAuthGuard],
          create: { disabled: true },
          update: { disabled: true },
          delete: { disabled: true },
        },
      ],
    }),
    BullModule.registerQueue({
      name: TRANSACTION_CALLBACK_QUEUE,
      redis: redisConfig.bullQueue,
      defaultJobOptions: {
        lifo: true,
        attempts: 15,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    }),
    BullModule.registerQueue({
      name: MOTOR_COVER_QUEUE,
      redis: redisConfig.bullQueue,
      defaultJobOptions: {
        lifo: true,
        attempts: 15,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionsModule {}
