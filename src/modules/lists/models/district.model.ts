import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import {
    FilterableField,
    KeySet,
    OffsetConnection,
} from '@ptc-org/nestjs-query-graphql';
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';
import { Country } from './country.model';
import { Region } from './region.model';

@ObjectType()
@KeySet(['id'])
@OffsetConnection('country', () => Country, {
    remove: { enabled: false },
    update: { enabled: false },
})
@OffsetConnection('region', () => Region, {
    remove: { enabled: false },
    update: { enabled: false },
})
@Entity()
export class District extends BaseEntity {
    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField()
    @Column({ unique: true })
    name: string;

    @FilterableField(() => Int)
    @Column({ type: 'int', unsigned: true })
    regionId: number;

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

    @ManyToOne(() => Country, (country) => country.districts)
    country: Country;

    @ManyToOne(() => Region, (region) => region.districts)
    region: Region;
}
