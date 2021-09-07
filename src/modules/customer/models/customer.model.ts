import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import {
    FilterableField,
    OffsetConnection,
    KeySet,
} from '@nestjs-query/query-graphql';
import { Region } from 'src/modules/lists/models/region.model';
import { AuthenticatedUser } from 'src/modules/auth/models/authenticated-user.interface';

@ObjectType()
@KeySet(['id'])
@OffsetConnection('region', () => Region, {
    nullable: true,
    disableUpdate: true,
    disableRemove: true,
})
@Entity()
export class Customer extends BaseEntity implements AuthenticatedUser {
    readonly type = 'customer';

    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField({ nullable: true })
    @Column({ default: true })
    active?: boolean;

    @FilterableField()
    @Column({ unique: true })
    phone: string;

    @FilterableField({ nullable: true })
    @Column({ unique: true, nullable: true })
    email?: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    firstName?: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    middleName?: string;

    @FilterableField({ nullable: true })
    @Column({ nullable: true })
    lastName?: string;

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

    @ManyToOne(() => Region, { nullable: true })
    region: Region;

    get fullName(): string {

        const names = [
            this.firstName,
            this.lastName,
        ];

        return names.join(' ').trim();
    }

    @Field({ nullable: true })
    @Column({ nullable: true })
    token: string;
}
