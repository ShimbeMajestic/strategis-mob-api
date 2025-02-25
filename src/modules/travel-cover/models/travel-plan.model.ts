import {
    FilterableField,
    FilterableRelation,
} from '@ptc-org/nestjs-query-graphql';
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
import { TravelDestination } from './travel-destination.model';
import { TravelEntity } from './travel-entity.model';
import { TravelProduct } from './travel-product.model';

@Entity()
@ObjectType()
@FilterableRelation('travelEntity', () => TravelEntity, { nullable: true })
@FilterableRelation('destination', () => TravelDestination, { nullable: true })
@FilterableRelation('travelProduct', () => TravelProduct, { nullable: true })
export class TravelPlan extends BaseEntity {
    @PrimaryGeneratedColumn()
    @FilterableField(() => ID)
    id: number;

    @Column()
    @FilterableField()
    title: string;

    @Column()
    @FilterableField()
    duration: number;

    @ManyToOne(() => TravelEntity)
    travelEntity: TravelEntity;

    @Column()
    @FilterableField()
    travelEntityId: number;

    @ManyToOne(() => TravelDestination)
    destination: TravelDestination;

    @Column()
    @FilterableField()
    destinationId: number;

    @Column({ nullable: true })
    @FilterableField({ nullable: true })
    travelProductId: number;

    @ManyToOne(() => TravelProduct, { nullable: true })
    travelProduct: TravelProduct;

    @Column()
    @FilterableField()
    price: number;

    @Column({ type: 'decimal', nullable: true })
    @FilterableField({ nullable: true })
    priceInUSD: number;

    @Column()
    @FilterableField()
    currency: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    package: string;

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
