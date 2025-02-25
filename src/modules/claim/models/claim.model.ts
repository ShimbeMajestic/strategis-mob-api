import {
  Authorize,
  FilterableField,
  Relation,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserContext } from 'src/modules/auth/models/authenticated-user.interface';
import { Customer } from 'src/modules/customer/models/customer.model';
import { MotorPolicy } from 'src/modules/motor-cover/models/motor-policy.model';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClaimAuthorizer } from '../authorizers/claim.authorizer';
import { ClaimEnum } from '../enums/claim.enum';

@Entity()/*marks the class as TypeORM entity */
@ObjectType()/* exposes the class as a GraphQl object*/
@Relation('policy', () => MotorPolicy)/* defines a relation to motor policy entity*/
@Relation('customer', () => Customer)/*defines a relation to customer entity */
@Authorize(ClaimAuthorizer)
export class Claim extends BaseEntity {
  /*Primary Key (id)*/
  @PrimaryGeneratedColumn()/*autogenerates a unique ID for each claim */
  @FilterableField(() => ID)/*filters claims by ID in GraphQl queries*/
  id: number;

  @Column()
  @Field()
  policyId: number;/* policy id is stored as a column (foreign key)*/

  @ManyToOne(() => MotorPolicy)
  policy: MotorPolicy;

  @Column()
  @Field()
  customerId: number;/* stores the customer making the claim*/

  @ManyToOne(() => Customer)
  customer: Customer;

  @Column({/* manages claim statuses*/
    default: ClaimEnum.PENDING,/* set to pending(as default) once a new claim is created*/
    enum: ClaimEnum,
    enumName: 'ClaimEnum',
  })
  @Field()
  status: ClaimEnum;

  /* claim details*/
  @FilterableField(() => GraphQLISODateTime, { nullable: true })
  @Column({ nullable: true })
  dateOfAccident: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  locationOfAccident: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  alternatePhoneNumber: string;

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true, nullable: true })
  imageUrls: string[];

  /* New Fields Added */
  
  @Field({ nullable: true })
  @Column({ nullable: true })
  registrationNumber: string; /* this column stores the vehicle's registration number */

  @Field({ nullable: true })
  @Column({ nullable: true })
  covernoteNumber: string; /* identifier of the cover note */

  @Field({ nullable: true })
  @Column({ nullable: true })
  incidentType: string; /* type of incident that occurred */

  @Field({ nullable: true })
  @Column({ nullable: true })
  registration: string; /* registration of the vehicle */

  @Field({ nullable: true })
  @Column({ nullable: true })
  region: string; /* region where the incident took place */

  @Field({ nullable: true })
  @Column({ nullable: true })
  district: string; /* district where the incident took place */

  @Field({ nullable: true })
  @Column({ nullable: true })
  street: string; /* street where the incident took place */

  @Field({ nullable: true })
  @Column({ nullable: true })
  driversName: string; /* name of the driver involved in the incident */

  @Field({ nullable: true })
  @Column({ nullable: true })
  driversLicense: string; /* driver's license number */

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ nullable: true })
  driversDateOfBirth: Date; /* driver's date of birth */

  @Field()
  @Column({ default: false }) /* indicates if other property is damaged */
  isOtherPropertyDamaged: boolean; /* true or false */

  @Field()
  @Column({ default: false }) /* indicates if a person is injured */
  isPersonInjured: boolean; /* true or false */

  @Field(() => Int, { nullable: true }) /* number of injured people if true */
  @Column({ nullable: true })
  numberOfInjured: number;

  @Field()
  @Column({ default: false }) /* indicates if there is a death */
  isDeath: boolean; /* true or false */

  @Field(() => Int, { nullable: true }) /* number of deaths if true */
  @Column({ nullable: true })
  numberOfDeaths: number;

  /*timestamps for record management */
  @FilterableField(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;/* autosets a date when a claim is submitted*/

  @FilterableField(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;/* provides updates whenever the claim record is modified*/

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date; /* stops a timestamp when a claim is deleted*/
}
