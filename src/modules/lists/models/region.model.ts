import {
    FilterableField,
    KeySet,
    OffsetConnection,
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
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Country } from './country.model';
import { District } from './district.model';
import { Customer } from 'src/modules/customer/models/customer.model';
import { User } from 'src/modules/user/models/user.model';

@ObjectType()
@KeySet(['id'])
@OffsetConnection('country', () => Country, {
    remove: { enabled: false },
    update: { enabled: false },
})
@OffsetConnection('districts', () => District, {
    remove: { enabled: false },
    update: { enabled: false },
})
@Entity()
export class Region extends BaseEntity {
    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField()
    @Column({ unique: true })
    name: string;

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

    @ManyToOne(() => Country, (country) => country.regions)
    country: Country;

    @OneToMany(() => District, (district) => district.region)
    districts: District[];

    @OneToMany(() => User, (user) => user.region)
    users: User[];
}
