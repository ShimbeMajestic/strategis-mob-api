import {
    FilterableField,
    OffsetConnection,
    PagingStrategies,
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
export class MotorCover extends BaseEntity {
    @PrimaryGeneratedColumn()
    @FilterableField(() => ID)
    id: number;

    @FilterableField()
    @Column()
    name: string;

    @FilterableField()
    @Column()
    description: string;

    @FilterableField()
    @Column({ default: '01' })
    code: string;

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
