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
import { MotorCoverRequestAuthorizer } from '../authorizers/motor-cover-request.authorizer';
import { MotorCoverRequestStatus } from '../enums/motor-cover-req-status.enum';
import { MotorUsageType } from '../enums/motor-usage.enum';
import { MotorCoverDuration } from './motor-cover-duration.model';
import { MotorCoverType } from './motor-cover-type.model';
import { MotorCover } from './motor-cover.model';
import { VehicleDetails } from './vehicle-details.model';

@Entity()
@ObjectType()
@Authorize(MotorCoverRequestAuthorizer)
@Relation('motorCover', () => MotorCover, { nullable: true })
@Relation('motorCoverType', () => MotorCoverType, { nullable: true })
@Relation('motorCoverDuration', () => MotorCoverDuration, { nullable: true })
@Relation('vehicleDetails', () => VehicleDetails, { nullable: true })
@Relation('customer', () => Customer, { nullable: true })
@OffsetConnection('transactions', () => Transaction, {
  nullable: true,
  pagingStrategy: PagingStrategies.NONE,
})
export class MotorCoverRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  @FilterableField(() => ID)
  id: number;

  @ManyToOne(() => MotorCover)
  motorCover: MotorCover;

  @ManyToOne(() => MotorCoverType)
  motorCoverType: MotorCoverType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  motorCoverTypeId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  motorCoverId: number;

  @ManyToOne(() => MotorCoverDuration, { nullable: true })
  motorCoverDuration: MotorCoverDuration;

  @ManyToOne(
    () => VehicleDetails,
    (vehicleDetails) => vehicleDetails.motorCoverRequest,
    { nullable: true },
  )
  vehicleDetails: VehicleDetails;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Field()
  @Column()
  customerId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  vehicleDetailsId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  vehicleType: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  motorCoverDurationId: number;

  @FilterableField()
  @Column({ default: MotorCoverRequestStatus.PENDING })
  status: MotorCoverRequestStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  statusDescription: string;

  @FilterableField(() => GraphQLISODateTime, { nullable: true })
  @Column({ nullable: true })
  coverNoteStartDate: Date;

  @FilterableField(() => GraphQLISODateTime, { nullable: true })
  @Column({ nullable: true })
  coverNoteEndDate: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.motorCoverRequest)
  transactions: Transaction[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  minimumAmount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  minimumAmountIncTax: number;

  @Field()
  @Column({ default: 'TZS' })
  currency: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  productCode: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  productName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  riskCode: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  riskName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  usageType: MotorUsageType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  requestId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coverNoteNumber: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coverNoteReferenceNumber: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  policyNumber: string;

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
