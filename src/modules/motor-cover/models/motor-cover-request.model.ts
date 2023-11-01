import {
    Authorize,
    FilterableField,
    FilterableUnPagedRelation,
    OffsetConnection,
    PagingStrategies,
    Relation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Customer } from 'src/modules/customer/models/customer.model';
import { Transaction } from 'src/modules/transactions/models/transaction.model';
import { User } from 'src/modules/user/models/user.model';
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
import { VehiclePhoto } from './vehicle-photo.model';

@Entity()
@ObjectType()
@Authorize(MotorCoverRequestAuthorizer)
@Relation('motorCover', () => MotorCover, { nullable: true })
@Relation('motorCoverType', () => MotorCoverType, { nullable: true })
@Relation('motorCoverDuration', () => MotorCoverDuration, { nullable: true })
@Relation('vehicleDetails', () => VehicleDetails, { nullable: true })
@Relation('customer', () => Customer, { nullable: true })
@Relation('approvedBy', () => User, { nullable: true })
@OffsetConnection('transactions', () => Transaction, {
    nullable: true,
    pagingStrategy: PagingStrategies.NONE,
})
@FilterableUnPagedRelation('vehiclePhotos', () => VehiclePhoto, {
    nullable: true,
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

    @Field({ nullable: true })
    @Column({ default: 'PENDING' })
    policySubmissionStatus: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    policySubmissionMessage: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    policySubmissionSentAt: Date;

    @FilterableField(() => GraphQLISODateTime, { nullable: true })
    @Column({ nullable: true })
    coverNoteStartDate: Date;

    @FilterableField(() => GraphQLISODateTime, { nullable: true })
    @Column({ nullable: true })
    coverNoteEndDate: Date;

    @OneToMany(
        () => Transaction,
        (transaction) => transaction.motorCoverRequest,
    )
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

    @Field()
    @Column({ default: false })
    requiresApproval: boolean;

    @Field()
    @Column({ default: true })
    approved: boolean;

    @Field({ nullable: true })
    @ManyToOne(() => User)
    approvedBy: User;

    @Field({ nullable: true })
    @Column({ nullable: true })
    approvedAt: Date;

    @FilterableField(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => VehiclePhoto, (photo) => photo.motorCoverRequest, {
        cascade: true,
    })
    vehiclePhotos: VehiclePhoto[];
}
