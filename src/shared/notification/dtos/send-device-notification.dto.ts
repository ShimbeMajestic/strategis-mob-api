import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendNotificationDto {
    @Field()
    token: string;

    @Field()
    title: string;

    @Field()
    body: string;

    @Field({ nullable: true })
    image?: string = '';
}
