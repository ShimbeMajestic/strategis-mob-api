import { FilterableField } from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Location } from './location.model';

@Entity()
@ObjectType()
export class Hospital extends BaseEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @FilterableField()
  name: string;

  @Column()
  @FilterableField()
  address: string;

  @Column({ nullable: true })
  @FilterableField({ nullable: true })
  email: string;

  @Column({ nullable: true })
  @FilterableField({ nullable: true })
  website: string;

  @Column({ nullable: true })
  @FilterableField({ nullable: true })
  phone: string;

  @Field(() => Location, {
    nullable: true,
    description: 'Location with longitude and latitude',
  })
  @Column('jsonb', {
    nullable: true,
    transformer: {
      to: (value) => value,
      from: (value) => plainToClass(Location, value),
    },
  })
  location: Location;

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
