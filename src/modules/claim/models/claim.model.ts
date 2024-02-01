import {
    Authorize,
    FilterableField,
    FilterableRelation,
    Relation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Customer } from 'src/modules/customer/models/customer.model';
import { MotorPolicy } from 'src/modules/motor-cover/models/motor-policy.model';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ClaimAuthorizer } from '../authorizers/claim.authorizer';
import { ClaimEnum } from '../enums/claim.enum';
import { ClaimPhoto } from './claim-photo.model';
import { VehiclePhoto } from 'src/modules/motor-cover/models/vehicle-photo.model';

@Entity()
@ObjectType()
@Relation('policy', () => MotorPolicy)
@Relation('customer', () => Customer)
@FilterableRelation('claimPhotos', () => ClaimPhoto, {
    nullable: true,
})
@Authorize(ClaimAuthorizer)
export class Claim extends BaseEntity {
    @PrimaryGeneratedColumn()
    @FilterableField(() => ID)
    id: number;

    @Column()
    @Field()
    policyId: number;

    @ManyToOne(() => MotorPolicy)
    policy: MotorPolicy;

    @Column()
    @Field()
    customerId: number;

    @ManyToOne(() => Customer)
    customer: Customer;

    @Column({
        default: ClaimEnum.PENDING,
        enum: ClaimEnum,
        enumName: 'ClaimEnum',
    })
    @Field()
    status: ClaimEnum;

    @FilterableField(() => GraphQLISODateTime, { nullable: true })
    @Column({ nullable: true })
    dateOfAccident: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
    locationOfAccident: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    alternatePhoneNumber: string;

    @OneToMany(() => ClaimPhoto, (photo) => photo.claim, {
        cascade: true,
    })
    claimPhotos: ClaimPhoto[];

    @FilterableField(() => GraphQLISODateTime)
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @DeleteDateColumn()
    deletedAt: Date;
}
