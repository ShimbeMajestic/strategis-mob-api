import { QueryArgsType } from '@ptc-org/nestjs-query-graphql';
import { ArgsType, Query, Resolver } from '@nestjs/graphql';
import { Transaction } from '../models/transaction.model';
import { AllowUserType } from 'src/modules/permission/decorators/user-type.decorator';
import { UserTypeEnum } from 'src/modules/permission/enums/user-type.enum';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';

@ArgsType()
export class TransactionQuery extends QueryArgsType(Transaction) {}
export const TransactionConnection = TransactionQuery.ConnectionType;

@Resolver(() => Transaction)
@UseGuards(GqlAuthGuard)
export class TransactionResolver {
    @Query(() => [Transaction])
    @AllowUserType(UserTypeEnum.ADMIN)
    async allTransactions(): Promise<Transaction[]> {
        return await Transaction.find({
            order: {
                id: 'DESC',
            },
        });
    }
}
