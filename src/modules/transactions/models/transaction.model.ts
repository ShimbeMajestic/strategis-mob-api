import {
    Authorize,
    FilterableField,
    Relation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserContext } from 'src/modules/auth/models/authenticated-user.interface';
import { Customer } from 'src/modules/customer/models/customer.model';
import { MotorCoverRequest } from 'src/modules/motor-cover/models/motor-cover-request.model';
import { TravelCoverRequest } from 'src/modules/travel-cover/models/travel-cover-request.model';
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
import { TransactionAuthorizer } from '../authorizers/transaction.authorizer';
import { TransactionStatusEnum } from '../enums/transaction.enum';

@Entity()
@ObjectType()
@Relation('motorCoverRequest', () => MotorCoverRequest, { nullable: true })
@Relation('travelCoverRequest', () => TravelCoverRequest, { nullable: true })
@Relation('customer', () => Customer, { nullable: true })
@Authorize(TransactionAuthorizer)
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    @FilterableField(() => ID)
    id: number;

    @ManyToOne(() => MotorCoverRequest)
    motorCoverRequest: MotorCoverRequest;

    @Column({ nullable: true })
    @Field({ nullable: true })
    motorCoverRequestId: number;

    @ManyToOne(
        () => TravelCoverRequest,
        (travelCoverRequest) => travelCoverRequest.transactions,
    )
    travelCoverRequest: TravelCoverRequest;

    @Column({ nullable: true })
    @Field({ nullable: true })
    travelCoverRequestId: number;

    @Field()
    @Column()
    customerId: number;

    @ManyToOne(() => Customer, (customer) => customer.transactions)
    customer: Customer;

    @Column()
    @FilterableField()
    amount: number;

    @Column({
        default: 'TZS',
    })
    @Field()
    currency: string;

    @Column({
        enum: TransactionStatusEnum,
        enumName: 'TransactionStatusEnum',
        default: TransactionStatusEnum.PENDING,
    })
    @FilterableField()
    status: TransactionStatusEnum;

    @FilterableField()
    @Column({
        default: 'SELCOM',
    })
    provider: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    operator: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    operatorReferenceId: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    reference: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    buyerPhoneNumber: string;

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
