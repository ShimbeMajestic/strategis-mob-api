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

@ObjectType()
@Entity()
@Relation('customer', () => Customer, { nullable: true })
export class HealthCoverEnquiry extends BaseEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @FilterableField({ nullable: true })
  customerId: number;

  @ManyToOne(() => Customer, { nullable: true })
  customer: Customer;

  @Column()
  @FilterableField()
  customerName: string;

  @Column()
  @FilterableField()
  city: string;

  @Column()
  @FilterableField()
  age: number;

  @Column()
  @FilterableField()
  gender: string;

  @Column()
  @FilterableField()
  numberOfDependents: number;

  @Column()
  @Field()
  mobileNumber: string;

  @Column()
  @FilterableField()
  email: string;

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
