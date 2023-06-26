import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToMany,
    JoinTable,
    BeforeInsert,
    ManyToOne,
} from 'typeorm';
import { Permission } from 'src/modules/permission/models/permission.model';
import {
    FilterableField,
    KeySet,
    OffsetConnection,
} from '@ptc-org/nestjs-query-graphql';
import { Hash } from 'src/shared/helpers/hash.helper';
import { Region } from 'src/modules/lists/models/region.model';
import { Country } from 'src/modules/lists/models/country.model';
import { Role } from 'src/modules/permission/models/role.model';
import { Person } from 'src/modules/lists/models/person.model';
import { AuthenticatedUser } from 'src/modules/auth/models/authenticated-user.interface';

@ObjectType()
@KeySet(['id'])
@OffsetConnection('role', () => Role)
@OffsetConnection('permissions', () => Permission)
@OffsetConnection('country', () => Country, {
    nullable: true,
    update: { enabled: false },
    remove: { enabled: false },
})
@OffsetConnection('region', () => Region, {
    nullable: true,
    update: { enabled: false },
    remove: { enabled: false },
})
@Entity()
export class User extends Person implements AuthenticatedUser {
    readonly type = 'user';

    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    roleId: number;

    @FilterableField()
    @Column({ unique: true })
    email: string;

    @Column({ comment: 'Hashed password' })
    password: string;

    @FilterableField({ nullable: true, defaultValue: true })
    @Column({ default: true })
    active?: boolean;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    residenceID?: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    workID?: string;

    @FilterableField(() => Int, { nullable: true })
    @Column({ type: 'int', unsigned: true, nullable: true })
    countryId?: number;

    @FilterableField(() => Int, { nullable: true })
    @Column({ type: 'int', unsigned: true, nullable: true })
    regionId?: number;

    @FilterableField(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Country)
    country: Country;

    @ManyToOne(() => Region)
    region: Region;

    @ManyToMany(() => Permission, (permission) => permission.users)
    @JoinTable({ name: 'user_permission' })
    permissions: Permission[];

    @ManyToOne(() => Role, (role) => role.users)
    role: Role;

    @BeforeInsert()
    async beforeInsert() {
        this.password = await Hash.make(this.password);
    }
}
