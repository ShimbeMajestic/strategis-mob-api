import { FilterableField, Relation } from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Customer } from 'src/modules/customer/models/customer.model';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TravelPlan } from './travel-plan.model';

@Entity()
@ObjectType()
@Relation('plan', () => TravelPlan)
export class TravelCoverRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
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

  @FilterableField(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;
}
