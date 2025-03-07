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
    FilterableRelation,
} from '@ptc-org/nestjs-query-graphql';
import { Region } from 'src/modules/lists/models/region.model';
import { AuthenticatedUser } from 'src/modules/auth/models/authenticated-user.interface';
import { IdType } from '../enum/id-type.enum';
import { Transaction } from 'src/modules/transactions/models/transaction.model';
import { TravelCoverRequest } from 'src/modules/travel-cover/models/travel-cover-request.model';
import { MotorPolicy } from 'src/modules/motor-cover/models/motor-policy.model';
import { District } from 'src/modules/lists/models/district.model';

@ObjectType()
@KeySet(['id'])
@FilterableRelation('region', () => Region, {
    nullable: true,
    remove: { enabled: false },
    update: { enabled: false },
})
@FilterableRelation('district', () => District, {
    nullable: true,
    remove: { enabled: false },
    update: { enabled: false },
})
@FilterableRelation('transactions', () => Transaction, {
    nullable: true,
    remove: { enabled: false },
    update: { enabled: false },
})
@FilterableRelation('policies', () => MotorPolicy, {
    nullable: true,
    remove: { enabled: false },
    update: { enabled: false },
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

    @Field({ nullable: true })
    @Column({ nullable: true })
    gender: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    dob: string;

    @Field({ nullable: true })
    @Column({
        enum: IdType,
        nullable: true,
    })
    identityType: IdType;

    @Field({ nullable: true })
    @Column({ nullable: true })
    identityNumber: string;

    @FilterableField(() => Int, { nullable: true })
    @Column({ type: 'int', unsigned: true, nullable: true })
    regionId?: number;

    @FilterableField(() => Int, { nullable: true })
    @Column({ type: 'int', unsigned: true, nullable: true })
    districtId: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    address: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    termsAccepted: boolean;

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

    @ManyToOne(() => District, { nullable: true })
    district: District;

    @OneToMany(() => Transaction, (transaction) => transaction.customer)
    transactions: Transaction[];

    @OneToMany(
        () => TravelCoverRequest,
        (travelCoverRequest) => travelCoverRequest.customer,
    )
    travelPlanRequests: TravelCoverRequest[];

    @OneToMany(() => MotorPolicy, (motorPolicy) => motorPolicy.customer)
    policies: MotorPolicy;

    get fullName(): string {
        const names = [this.firstName, this.lastName];

        return names.join(' ').trim();
    }

    @Field({ nullable: true })
    @Column({ nullable: true })
    token: string;
}
