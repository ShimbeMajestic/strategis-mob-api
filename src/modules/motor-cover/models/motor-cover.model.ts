import {
  FilterableField,
  OffsetConnection,
  PagingStrategies,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MotorCoverDuration } from './motor-cover-duration.model';
import { MotorCoverType } from './motor-cover-type.model';

@ObjectType()
@Entity()
@OffsetConnection('durations', () => MotorCoverDuration, {
  nullable: true,
  pagingStrategy: PagingStrategies.NONE,
})
@OffsetConnection('types', () => MotorCoverType, {
  nullable: true,
  pagingStrategy: PagingStrategies.NONE,
})
export class MotorCover {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @OneToMany(
    () => MotorCoverDuration,
    (coverDuration) => coverDuration.motorCover,
    { nullable: true },
  )
  durations: MotorCoverDuration[];

  @OneToMany(() => MotorCoverType, (type) => type.motorCover, {
    nullable: true,
  })
  types: MotorCoverType[];

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
