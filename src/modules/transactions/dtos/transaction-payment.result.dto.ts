import { Field, ObjectType } from '@nestjs/graphql';
import { Transaction } from '../models/transaction.model';

@ObjectType()
export class TransactionPaymentResultDto {
  @Field()
  success: boolean;

  @Field(() => Transaction, { nullable: true })
  transaction: Transaction;

  @Field()
  message: string;

  @Field({ nullable: true })
  redirectUrl?: string;
}
