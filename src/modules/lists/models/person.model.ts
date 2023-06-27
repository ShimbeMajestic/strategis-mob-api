import { FilterableField } from '@ptc-org/nestjs-query-graphql';
import { GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column } from 'typeorm';
import { GenderEnum } from '../enums/gender.enum';

@ObjectType()
export class Person extends BaseEntity {
    @FilterableField()
    @Column({ nullable: true })
    firstName: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    middleName?: string;

    @FilterableField()
    @Column({ nullable: true })
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
