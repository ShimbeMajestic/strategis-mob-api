import {
    FilterableField,
    KeySet,
    OffsetConnection,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    ManyToOne,
    BeforeInsert,
} from 'typeorm';
import { Country } from './country.model';

@ObjectType()
@KeySet(['id'])
@OffsetConnection('country', () => Country, {
    disableUpdate: true,
    disableRemove: true,
})
@Entity()
export class Region extends BaseEntity {
    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField()
    @Column({ unique: true })
    name: string;

    @FilterableField({ nullable: true })
    @Column({ unique: true, nullable: true })
    code: string;

    @FilterableField(() => Int)
    @Column({ type: 'int', unsigned: true })
    countryId: number;

    @FilterableField(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(
        () => Country,
        country => country.regions,
    )
    country: Country;

    @BeforeInsert()
    async beforeInsert() {
        this.code = this.code ? this.code.toUpperCase() : null;
    }
}
