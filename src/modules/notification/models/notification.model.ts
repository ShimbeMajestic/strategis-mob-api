import {
  Authorize,
  FilterableField,
  Relation,
} from '@ptc-org/nestjs-query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserContext } from 'src/modules/auth/models/authenticated-user.interface';
import { Customer } from 'src/modules/customer/models/customer.model';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from '../enums/notification-type.enum';

@Entity()
@ObjectType()
@Authorize({
  authorize: (context: UserContext) => ({
    customerId: { eq: context.req.user.id },
  }),
})
@Relation('customer', () => Customer, { nullable: true })
export class Notification {
  @PrimaryGeneratedColumn()
  @FilterableField(() => ID)
  id: number;

  @Field()
  @Column()
  title: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Column()
  @Field()
  customerId: number;

  @Column({ enum: NotificationType, default: NotificationType.INFO })
  @Field()
  notificationType: NotificationType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  travelCoverRequestId: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  motorCoverRequestId: number;

  @Field()
  @Column()
  message: string;

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
