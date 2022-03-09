import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ApprovalDto {
  @Field()
  requestId: string;

  @Field()
  approve: boolean;
}
