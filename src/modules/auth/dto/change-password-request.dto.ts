import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ChangePasswordRequest {
    @Field()
    currentPassword: string;

    @Field()
    newPassword: string;

    @Field()
    newPasswordConfirmation: string;
}
