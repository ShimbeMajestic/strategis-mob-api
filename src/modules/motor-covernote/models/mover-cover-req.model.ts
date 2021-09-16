import { FilterableField, OffsetConnection } from "@nestjs-query/query-graphql";
import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { Customer } from "src/modules/customer/models/customer.model";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MotorCoverRequestStatus } from "../enums/motor-cover-req-status.enum";
import { MotorCoverDuration } from "./motor-cover-duration.model";
import { MotorCover } from "./motor-cover.model";
import { VehicleDetails } from "./vehicle-details.model";

@Entity()
@ObjectType()
@OffsetConnection('motorCover', () => MotorCover, { nullable: true })
@OffsetConnection('motorCoverDuration', () => MotorCoverDuration, { nullable: true })
@OffsetConnection('vehicleDetails', () => VehicleDetails, { nullable: true })
@OffsetConnection('customer', () => Customer, { nullable: true })
export class MotorCoverRequest extends BaseEntity {

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @ManyToOne(() => MotorCover)
    motorCover: MotorCover;

    @Field({ nullable: true })
    @Column({ nullable: true })
    motorCoverId: number;

    @ManyToOne(() => MotorCoverDuration, { nullable: true })
    motorCoverDuration: MotorCoverDuration;

    @ManyToOne(() => VehicleDetails,
        vehicleDetails => vehicleDetails.motorCoverRequest,
        { nullable: true }
    )
    vehicleDetails: VehicleDetails;

    @Field()
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
    motorCoverDurationId: number;

    @Field()
    @Column({ default: MotorCoverRequestStatus.PENDING })
    status: MotorCoverRequestStatus;

    @Field({ nullable: true })
    @Column({ nullable: true })
    amount: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    currency: string;

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