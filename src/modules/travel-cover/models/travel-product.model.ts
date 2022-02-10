import { FilterableField } from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class TravelProduct {
  @PrimaryGeneratedColumn()
  @FilterableField(() => ID)
  id: number;

  @Column()
  @FilterableField()
  productId: string;

  @Column()
  @FilterableField()
  productName: string;

  @Column()
  @FilterableField()
  productSuffix: string;

  /**
   * @TODO confirm below
   * 1 = AFRICA
   * 14 = EUROPE
   * 12 = ASIA
   * 3 = WORDLWIDE
   */
  @Column()
  @FilterableField()
  destinationCode: string;

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
