import { FilterableField, Relation } from "@nestjs-query/query-graphql";
import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { Customer } from "src/modules/customer/models/customer.model";
import { MotorCoverRequest } from "src/modules/motor-covernote/models/mover-cover-req.model";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TransactionStatusEnum } from "../enums/transaction.enum";

@Entity()
@ObjectType()
@Relation('cover', () => MotorCoverRequest, { nullable: true })
@Relation('customer', () => Customer, { nullable: true })
export class Transaction extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @ManyToOne(() => MotorCoverRequest)
    request: MotorCoverRequest;

    @Field()
    @Column()
    customerId: number;

    @ManyToOne(
        () => Customer,
        customer => customer.transactions
    )
    customer: Customer;

    @Column()
    @Field()
    requestId: number;

    @Column()
    @Field()
    amount: number;

    @Column({
        default: "TZS"
    })
    @Field()
    currency: string;

    @Column({
        enum: TransactionStatusEnum,
        enumName: 'TransactionStatusEnum'
    })
    @Field()
    status: TransactionStatusEnum;

    @FilterableField()
    @Column()
    provider: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    operator: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    operatorReferenceId: string;

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