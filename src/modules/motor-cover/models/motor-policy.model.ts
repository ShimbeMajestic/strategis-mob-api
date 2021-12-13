import {
  Authorize,
  FilterableField,
  Relation,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserContext } from 'src/modules/auth/models/authenticated-user.interface';
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
import { MotorCoverRequest } from './motor-cover-request.model';

@ObjectType()
@Entity()
@Relation('motorCoverRequest', () => MotorCoverRequest)
@Authorize({
  authorize: (context: UserContext) => ({
    customerId: { eq: context.req.user.id },
  }),
})
@Relation('customer', () => Customer)
export class MotorPolicy extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  policyNumber: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  coverNoteNumber: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  coverStartDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  coverEndDate: Date;

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
