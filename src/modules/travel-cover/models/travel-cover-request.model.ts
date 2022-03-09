import {
  Authorize,
  FilterableField,
  OffsetConnection,
  PagingStrategies,
  Relation,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserContext } from 'src/modules/auth/models/authenticated-user.interface';
import { Customer } from 'src/modules/customer/models/customer.model';
import { TransactionStatusEnum } from 'src/modules/transactions/enums/transaction.enum';
import { Transaction } from 'src/modules/transactions/models/transaction.model';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TravelCoverRequestAuthorizer } from '../authorizers/travel-cover-request.authorizer';
import { TravelStatusEnum } from '../enums/travel-status.enum';
import { TravelPlan } from './travel-plan.model';

@Entity()
@ObjectType()
@Relation('plan', () => TravelPlan)
@OffsetConnection('transactions', () => Transaction, {
  nullable: true,
  disableUpdate: true,
  disableRemove: true,
  pagingStrategy: PagingStrategies.NONE,
})
@Relation('customer', () => Customer)
@Authorize(TravelCoverRequestAuthorizer)
export class TravelCoverRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  @FilterableField(() => ID)
  id: number;

  @ManyToOne(() => TravelPlan)
  plan: TravelPlan;

  @Column()
  @Field()
  planId: number;

  @ManyToOne(() => Customer, (customer) => customer.travelPlanRequests)
  customer: Customer;

  @Column()
  @Field()
  customerId: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  departureDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  returnDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  passportNo: string;

  @FilterableField(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.travelCoverRequest)
  transactions: Transaction[];

  @FilterableField()
  @Column({
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.PENDING,
  })
  status: TravelStatusEnum;
}
