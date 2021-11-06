import { FilterableField, Relation } from '@nestjs-query/query-graphql';
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

@Entity()
@ObjectType()
@Relation('travelEntity', () => TravelEntity)
@Relation('destination', () => TravelDestination)
export class TravelPlan extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  duration: number;

  @ManyToOne(() => TravelEntity)
  travelEntity: TravelEntity;

  @Column()
  @Field()
  travelEntityId: number;

  @ManyToOne(() => TravelDestination)
  destination: TravelDestination;

  @Column()
  @Field()
  destinationId: number;

  @Column()
  @Field()
  price: number;

  @Column()
  @Field()
  currency: string;

  @Field({ nullable: true })
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
