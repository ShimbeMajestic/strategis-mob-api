import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { Transaction } from './models/transaction.model';

@Module({
    imports: [
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
                }
            ],
        }),
    ]
})
export class TransactionsModule { }
