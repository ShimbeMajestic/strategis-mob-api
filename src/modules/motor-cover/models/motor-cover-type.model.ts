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
import { MotorCategory } from '../enums/motor-category.enum';
import { MotorUsage } from '../enums/motor-usage.enum';
import { MotorCover } from './motor-cover.model';

@ObjectType()
@Entity()
@Relation('motorCover', () => MotorCover, { nullable: true })
export class MotorCoverType extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  productCode: string;

  @Column()
  @Field()
  productName: string;

  @Column({ nullable: true })
  @Field()
  usage: MotorUsage;

  @Column({ nullable: true })
  @Field()
  category: MotorCategory;

  @Column({ unique: true })
  @Field()
  riskCode: string;

  @Column()
  @Field()
  riskName: string;

  @Column()
  @Field()
  rate: number;

  @Column({ default: 0 })
  @Field()
  perSeatAmount: number;

  @Column()
  @Field()
  minimumAmount: number;

  @FilterableField(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => MotorCover, (cover) => cover.types)
  motorCover: MotorCover;

  @Field({ nullable: true })
  @Column({ nullable: true })
  motorCoverId: number;
}
