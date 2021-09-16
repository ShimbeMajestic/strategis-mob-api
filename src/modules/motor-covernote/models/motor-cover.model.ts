import { FilterableField, OffsetConnection } from "@nestjs-query/query-graphql";
import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MotorCoverDuration } from "./motor-cover-duration.model";

@ObjectType()
@Entity()
@OffsetConnection('durations', () => MotorCoverDuration, {
    nullable: true
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
        coverDuration => coverDuration.motorCover,
        { nullable: true }
    )
    durations: MotorCoverDuration[]

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