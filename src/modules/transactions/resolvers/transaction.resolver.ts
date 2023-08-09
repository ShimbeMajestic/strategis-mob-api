import { CRUDResolver, QueryArgsType } from '@ptc-org/nestjs-query-graphql';
import { UseGuards } from '@nestjs/common';
import { ArgsType, Query, Resolver } from '@nestjs/graphql';
import { UserTypeGuard } from 'src/modules/permission/guards/user-type.guard';
import { Transaction } from '../models/transaction.model';
import { TransactionCrudService } from '../providers/transaction-crud.service';

@ArgsType()
export class TransactionQuery extends QueryArgsType(Transaction) {}
export const TransactionConnection = TransactionQuery.ConnectionType;

@Resolver(() => Transaction)
export class TransactionResolver extends CRUDResolver(Transaction) {
    constructor(readonly transactionCrudService: TransactionCrudService) {
        super(transactionCrudService);
    }

    @Query(() => [Transaction])
    @UseGuards(UserTypeGuard)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    transactions() {}
}
