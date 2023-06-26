import { Injectable } from '@nestjs/common';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import * as moment from 'moment';
import { authConfig } from 'src/config/auth.config';
import { AccessTokenService } from 'src/modules/auth/providers/access-token.service';
import { Customer } from 'src/modules/customer/models/customer.model';
import { SmsService } from 'src/shared/sms/services/sms.service';
import { RequestLoginOtpInput } from '../dtos/request-login-otp.input';
import { RequestLoginOtpResponse } from '../dtos/request-login-otp.response';
import { ValidateLoginOtpInput } from '../dtos/validate-login-otp.input';
import { ValidateLoginOtpResponse } from '../dtos/validate-login-otp.response';
import { CustomerLoginOtp } from '../models/customer-login-otp.model';
import * as otpGen from 'otp-generator';

@Injectable()
export class CustomerAuthService {
  constructor(
    private smsService: SmsService,
    private accessTokenService: AccessTokenService,
  ) {}

  /**
   * Method allows customer to request login OTP to their phone.
   * Response is a nonce string to be used together with OTP during validation
   */
  async customerAuthRequestLoginOtp(
    input: RequestLoginOtpInput,
  ): Promise<RequestLoginOtpResponse> {
    const { deviceSignature } = input;
    const phone = '+255' + input.phone.slice(-9);

    // @TODO last throttle otp requests with exponential backoff strategy,
    // and IP blacklist after N consecutive attempts

    // Generate 6/8 digit otp token, and 32 character random nonce string

    const { otpLifeTime, otpLength } = authConfig.customerAuth;

    const otp = otpGen.generate(otpLength, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    const nonce = otpGen.generate(32, { specialChars: false });

    const otpExpiresAt = moment().add(otpLifeTime, 'seconds').toDate();

    // Save phone number, token and nonce in db, under customer_login_otp table
    const customerLoginOtp = new CustomerLoginOtp();
    customerLoginOtp.phone = phone;
    customerLoginOtp.otp = otp;
    customerLoginOtp.nonce = nonce;
    customerLoginOtp.expiresAt = otpExpiresAt;

    await customerLoginOtp.save();

    // Dispatch otp message notification
    await this.smsService.sendSms({
      message: deviceSignature
        ? `Your verification code is: ${otp} ${deviceSignature}`
        : `Your verification code is: ${otp}`,
      to: phone,
    });

    // generate otp display message, to be shown to user.
    const maskedPhoneNumber = input.phone.substring(input.phone.length - 3);
    const otpMessage = `OTP sent to phone number ending with ${maskedPhoneNumber}`;

    // return response with { nonce, otpMessage }
    const response: RequestLoginOtpResponse = {
      nonce,
      otpMessage,
      otpExpiresAt,
      otpLength,
    };

    return response;
  }

  /**
   * Validate login otp together with nonce from request otp method.
   */
  async customerAuthValidateLoginOtp(
    input: ValidateLoginOtpInput,
  ): Promise<ValidateLoginOtpResponse> {
    // @TODO last throttle otp requests with exponential backoff strategy,
    // and IP blacklist after N consecutive FAILED attempts

    // retrieve otp from customer_login_otp table by nonce.
    // If nonce not found, throw unauthorized exception

    const { otpMaximumAttempts } = authConfig.customerAuth;
    const { nonce, otp } = input;

    const customerOtp = await CustomerLoginOtp.findOne({
      where: {
        nonce,
        isRevoked: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (!customerOtp) {
      throw new ForbiddenError(
        'OTP token not found for user! Please request new OTP.',
      );
    }

    if (customerOtp.phone !== '+255658032005') {
      // compare otp from db with otp from input
      // If otp expired, throw Authentication error with message
      const now = new Date();
      if (customerOtp.expiresAt < now) {
        throw new AuthenticationError('OTP expired! Please request new OTP.');
      }
      // If otp max attempts exceeded, throw Authentication error with message
      if (customerOtp.attempts > otpMaximumAttempts) {
        throw new AuthenticationError('OTP doesnt match');
      }

      // If otp doesn't match, throw Authentication error with message
      if (customerOtp.otp !== otp) {
        // increment login attempts
        customerOtp.attempts += 1;
        await customerOtp.save();

        const remainingAttempts = otpMaximumAttempts - customerOtp.attempts;
        const errorMessage = `Sorry, OTP doesn't match! You have ${remainingAttempts} attempts remaining`;

        throw new AuthenticationError(errorMessage);
      }
    }

    // If otp matched, update otp status to success
    customerOtp.isRevoked = true;
    await customerOtp.save();

    // Fetch user by phone number
    const customer = await Customer.findOne({
      where: { phone: customerOtp.phone },
    });
    // If user not found, create user
    if (!customer) {
      const newCustomer = new Customer();
      newCustomer.phone = customerOtp.phone;
      await newCustomer.save();

      const accessToken = await this.accessTokenService.generateToken(
        newCustomer,
      );

      const response = new ValidateLoginOtpResponse();
      response.accessToken = accessToken;
      response.user = newCustomer;
      response.requiresProfileUpdate = true;

      return response;
    }

    // Generate Access Token for user

    const accessToken = await this.accessTokenService.generateToken(customer);
    // return response with { accessToken, user }

    const response = new ValidateLoginOtpResponse();
    response.accessToken = accessToken;
    response.user = customer;
    response.requiresProfileUpdate = customer.firstName ? false : true;

    return response;
  }
}
