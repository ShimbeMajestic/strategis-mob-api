import { QueryService } from '@ptc-org/nestjs-query-core';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
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
