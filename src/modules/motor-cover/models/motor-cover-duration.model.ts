import { FilterableField, OffsetConnection } from '@nestjs-query/query-graphql';
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
import { MotorCover } from './motor-cover.model';

@ObjectType()
@Entity()
@OffsetConnection('motorCover', () => MotorCover, {
  nullable: true,
})
export class MotorCoverDuration extends BaseEntity {
  @PrimaryGeneratedColumn()
  @FilterableField(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field({
    description: 'Duration in terms of days. i.e 30, 90',
  })
  duration: number;

  @ManyToOne(() => MotorCover, (cover) => cover.durations, { nullable: true })
  motorCover: MotorCover;

  @Column({ nullable: true })
  @FilterableField({ nullable: true })
  motorCoverId: number;

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
