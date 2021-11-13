import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNotificationDto {
  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  customerId: number;
}
