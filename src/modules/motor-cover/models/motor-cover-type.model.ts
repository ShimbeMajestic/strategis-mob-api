import { FilterableField, Relation } from '@ptc-org/nestjs-query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
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
import { MotorUsageType } from '../enums/motor-usage.enum';
import { VehicleTypeEnum } from '../enums/vehicle-type.enum';
import { MotorCover } from './motor-cover.model';

@ObjectType()
@Entity()
@Relation('motorCover', () => MotorCover, { nullable: true })
export class MotorCoverType extends BaseEntity {
    @PrimaryGeneratedColumn()
    @FilterableField(() => ID)
    id: number;

    @Column()
    @Field()
    productCode: string;

    @Column()
    @FilterableField()
    productName: string;

    @Column()
    @FilterableField()
    usage: MotorUsageType;

    @Column({ unique: true })
    @FilterableField({ nullable: true })
    riskCode: string;

    @Column()
    @FilterableField()
    riskName: string;

    @Column({ default: 0.0, type: 'numeric' })
    @Field()
    rate: number;

    @Column({ default: 0 })
    @Field()
    perSeatAmount: number;

    @Column()
    @Field()
    minimumAmount: number;

    @Column({ nullable: true })
    @FilterableField({ nullable: true })
    limitInKg: number;

    @ManyToOne(() => MotorCover, (cover) => cover.types)
    motorCover: MotorCover;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    motorCoverId: number;

    @FilterableField()
    @Column({
        enum: VehicleTypeEnum,
        enumName: 'VehicleTypeEnum',
        default: VehicleTypeEnum.FOUR_WHEELER,
    })
    vehicleType: VehicleTypeEnum;

    @Field()
    @Column({ default: 0 })
    addOnAmount: number;

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
