import {
    FilterableField,
    OffsetConnection,
    KeySet,
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
    OneToMany,
    BeforeInsert,
} from 'typeorm';
import { Region } from './region.model';

@ObjectType()
@KeySet(['id'])
@OffsetConnection('regions', () => Region, {
    disableUpdate: true,
    disableRemove: true,
})
@Entity()
export class Country extends BaseEntity {
    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField()
    @Column({ unique: true })
    name: string;

    @FilterableField({ nullable: true })
    @Column({ unique: true, nullable: true })
    code: string;

    @FilterableField(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(
        () => Region,
        region => region.country,
    )
    regions: Region[];

    @BeforeInsert()
    async beforeInsert() {
        this.code = this.code ? this.code.toUpperCase() : null;
    }
}
