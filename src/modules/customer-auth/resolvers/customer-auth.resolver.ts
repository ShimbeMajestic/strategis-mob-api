import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RequestLoginOtpInput } from '../dtos/request-login-otp.input';
import { RequestLoginOtpResponse } from '../dtos/request-login-otp.response';
import { ValidateLoginOtpInput } from '../dtos/validate-login-otp.input';
import { ValidateLoginOtpResponse } from '../dtos/validate-login-otp.response';
import { CustomerAuthService } from '../providers/customer-auth.service';

@Resolver()
export class CustomerAuthResolver {
    constructor(protected readonly service: CustomerAuthService) {}

    /**
     * Method allows customer to request login OTP to their phone.
     * Response is a nonce string to be used together with OTP during validation
     */
    @Mutation(() => RequestLoginOtpResponse)
    async customerLoginRequestOtp(
        @Args('input') input: RequestLoginOtpInput,
    ): Promise<RequestLoginOtpResponse> {
        return this.service.customerAuthRequestLoginOtp(input);
    }

    /**
     * Validate login otp together with nonce from request otp method.
     */
    @Mutation(() => ValidateLoginOtpResponse)
    async customerLoginValidateOtp(
        @Args('input') input: ValidateLoginOtpInput,
    ): Promise<ValidateLoginOtpResponse> {
        return this.service.customerAuthValidateLoginOtp(input);
    }
}
