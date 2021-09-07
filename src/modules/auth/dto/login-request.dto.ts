import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class LoginRequestDto {
    @Field()
    identifier: string;

    @Field()
    password: string;
}
