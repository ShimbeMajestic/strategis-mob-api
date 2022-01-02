import {
  Authorize,
  FilterableField,
  Relation,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Customer } from 'src/modules/customer/models/customer.model';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MotorPolicyAuthorizer } from '../authorizers/motor-policy.authorizer';
import { MotorCoverRequest } from './motor-cover-request.model';

@ObjectType()
@Entity()
@Relation('motorCoverRequest', () => MotorCoverRequest)
@Authorize(MotorPolicyAuthorizer)
@Relation('customer', () => Customer)
export class MotorPolicy extends BaseEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  eSticker: string;

  @Column()
  @Field()
  coverNoteReferenceNumber: string;

  @Column()
  @Field()
  coverNoteStartDate: Date;

  @Column()
  @Field()
  coverNoteEndDate: Date;

  @OneToOne(() => MotorCoverRequest)
  @JoinColumn()
  motorCoverRequest: MotorCoverRequest;

  @Column()
  @Field()
  motorCoverRequestId: number;

  @Column()
  @Field()
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.policies)
  customer: Customer;

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
