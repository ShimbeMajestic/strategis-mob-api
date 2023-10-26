import {
    FilterableField,
    OffsetConnection,
    KeySet,
} from '@ptc-org/nestjs-query-graphql';
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
import { District } from './district.model';

@ObjectType()
@KeySet(['id'])
@OffsetConnection('regions', () => Region, {
    remove: { enabled: false },
    update: { enabled: false },
})
@OffsetConnection('districts', () => District, {
    remove: { enabled: false },
    update: { enabled: false },
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

    @OneToMany(() => Region, (region) => region.country)
    regions: Region[];

    @OneToMany(() => District, (district) => district.country)
    districts: District[];

    @BeforeInsert()
    async beforeInsert() {
        this.code = this.code ? this.code.toUpperCase() : null;
    }
}
