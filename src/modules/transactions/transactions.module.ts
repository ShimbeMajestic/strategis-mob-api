import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
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
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionsModule {}
