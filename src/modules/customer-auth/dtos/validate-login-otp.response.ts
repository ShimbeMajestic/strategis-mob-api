import { Field, ObjectType } from '@nestjs/graphql';
import { Customer } from 'src/modules/customer/models/customer.model';

@ObjectType()
export class ValidateLoginOtpResponse {
    @Field()
    accessToken: string;

    @Field()
    user: Customer;

    @Field({
        deprecationReason:
            'Fixed issue on same flag on customer resource. Encourage using that one for consistent checking point',
    })
    requiresProfileUpdate: boolean;
}
