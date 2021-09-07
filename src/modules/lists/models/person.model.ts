import { FilterableField } from '@nestjs-query/query-graphql';
import { GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column } from 'typeorm';
import { GenderEnum } from '../enums/gender.enum';

@ObjectType()
export abstract class Person extends BaseEntity {
    @FilterableField()
    @Column()
    firstName: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    middleName?: string;

    @FilterableField()
    @Column()
    lastName: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    gender?: GenderEnum;

    @FilterableField(() => GraphQLISODateTime, { nullable: true })
    @Column({ nullable: true })
    dateOfBirth?: Date;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    email?: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    phone?: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    address?: string;
}
