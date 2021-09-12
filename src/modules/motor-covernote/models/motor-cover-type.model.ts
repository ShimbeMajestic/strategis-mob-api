import { FilterableField } from "@nestjs-query/query-graphql";
import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
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

    @Column()
    @Field()
    riskCode: string;

    @Column()
    @Field()
    riskName: string;

    @Column()
    @Field()
    rate: number;

    @Column()
    @Field()
    minimumAmount: number

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