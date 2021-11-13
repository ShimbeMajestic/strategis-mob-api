import { Field } from '@nestjs/graphql';

export class CreateNotificationDto {
  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  customerId: number;
}
