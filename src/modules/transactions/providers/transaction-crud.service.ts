import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../models/transaction.model';

@QueryService(Transaction)
export class TransactionCrudService extends TypeOrmQueryService<Transaction> {
  constructor(@InjectRepository(Transaction) repo: Repository<Transaction>) {
    // pass the use soft delete option to the service.
    super(repo, { useSoftDelete: true });
  }
}
