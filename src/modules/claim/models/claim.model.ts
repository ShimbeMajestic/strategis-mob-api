import {
  Authorize,
  FilterableField,
  Relation,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserContext } from 'src/modules/auth/models/authenticated-user.interface';
import { Customer } from 'src/modules/customer/models/customer.model';
import { MotorPolicy } from 'src/modules/motor-cover/models/motor-policy.model';
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
import { ClaimEnum } from '../enums/claim.enum';

@Entity()
@ObjectType()
@Relation('policy', () => MotorPolicy)
@Relation('customer', () => Customer)
@Authorize({
  authorize: (context: UserContext) => ({
    customerId: { eq: context.req.user.id },
  }),
})
export class Claim extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  policyId: number;

  @ManyToOne(() => MotorPolicy)
  policy: MotorPolicy;

  @Column()
  @Field()
  customerId: number;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Column({
    default: ClaimEnum.PENDING,
    enum: ClaimEnum,
    enumName: 'ClaimEnum',
  })
  @Field()
  status: ClaimEnum;

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
