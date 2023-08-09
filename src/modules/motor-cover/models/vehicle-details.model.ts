import {
    FilterableField,
    OffsetConnection,
} from '@ptc-org/nestjs-query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { MotorCategory } from '../enums/motor-category.enum';
import { MotorCoverRequest } from './motor-cover-request.model';

@Entity()
@ObjectType()
@OffsetConnection('motorCoverRequest', () => MotorCoverRequest, {
    nullable: true,
})
export class VehicleDetails extends BaseEntity {
    @PrimaryGeneratedColumn()
    @FilterableField(() => ID)
    id: number;

    @Field()
    @Column()
    MotorCategory: MotorCategory;

    @Field()
    @Column()
    RegistrationNumber: string;

    @Field()
    @Column()
    BodyType: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    SittingCapacity: number;

    @Field()
    @Column()
    ChassisNumber?: string;

    @Field()
    @Column()
    Make?: string;

    @Field()
    @Column()
    Model?: string;

    @Field()
    @Column()
    ModelNumber?: string;

    @Field()
    @Column()
    Color?: string;

    @Field()
    @Column()
    EngineNumber?: string;

    @Field()
    @Column()
    EngineCapacity?: number;

    @Field()
    @Column()
    FuelUsed?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    NumberOfAxles?: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    AxleDistance?: number;

    @Field()
    @Column()
    YearOfManufacture?: number;

    @Field()
    @Column()
    TareWeight?: number;

    @Field()
    @Column()
    GrossWeight?: number;

    @Field()
    @Column()
    MotorUsage?: string;

    @Field()
    @Column()
    OwnerName?: string;

    @Field()
    @Column()
    OwnerCategory?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    OwnerAddress?: string;

    @Field()
    @Column({ default: 0 })
    value: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    backViewImageUrl: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    frontViewImageUrl: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    leftSideViewImageUrl: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    rightSideViewImageUrl: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    bonnetViewImageUrl: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    dashboardOdoImageUrl: string;

    @OneToMany(() => MotorCoverRequest, (request) => request.vehicleDetails, {
        nullable: true,
    })
    motorCoverRequest: MotorCoverRequest;

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
