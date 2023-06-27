import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BaseEntity,
    Entity,
    ManyToMany,
    JoinTable,
    Column,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Permission } from './permission.model';
import { GuardType } from './guard-type.enum';
import {
    FilterableField,
    OffsetConnection,
    PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { User } from 'src/modules/user/models/user.model';

@ObjectType()
@OffsetConnection('permissions', () => Permission, {
    pagingStrategy: PagingStrategies.NONE,
})
@OffsetConnection('users', () => User)
@Entity()
export class Role extends BaseEntity {
    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField()
    @Column()
    name: string;

    @FilterableField()
    @Column()
    guard: GuardType;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    code: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt?: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt?: Date;

    @Field({ nullable: true })
    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToMany(() => Permission, (permission) => permission.roles)
    @JoinTable({ name: 'role_permission' })
    permissions: Permission[];

    @ManyToMany(() => User, (user) => user.role)
    users: User[];
}
