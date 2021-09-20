import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PaymentResult {
    @Field()
    success: boolean;

    @Field()
    message: string;
}