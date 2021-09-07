import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/modules/user/providers/user.service';
import { User } from 'src/modules/user/models/user.model';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { ChangePasswordRequest } from './dto/change-password-request.dto';
import { Hash } from 'src/shared/helpers/hash.helper';
import { AccessToken } from './models/access-token.model';
import { AuthenticationError } from 'apollo-server-express';
import { Validator } from 'src/shared/helpers/validator.helper';
import { AccessTokenService } from './providers/access-token.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');

    constructor(
        protected readonly userService: UserService,
        protected readonly accessTokenService: AccessTokenService,
    ) { }

    async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
        const user = await this.validateUserCredentials(loginDto);

        const accessToken: string = await this.accessTokenService.generateToken(
            user,
        );

        const loginResponse = new LoginResponseDto();
        loginResponse.accessToken = accessToken;
        loginResponse.user = user;

        return loginResponse;
    }

    private async validateUserCredentials(
        loginDto: LoginRequestDto,
    ): Promise<User> {
        const { identifier, password } = loginDto;

        let user: User;

        // Find by Email
        if (Validator.isEmail(identifier)) {
            user = await User.findOne({ email: identifier });
        }
        // Find by Phone Number
        else if (Validator.isPhone(identifier)) {
            user = await User.findOne({ phone: identifier });
        } else {
            throw new AuthenticationError(
                'Invalid identifier provided! Identifier must be a VALID email or phone.',
            );
        }

        // invalid username
        if (!user) {
            this.logger.debug(`Invalid Username: ${identifier}`);
            throw new AuthenticationError('Invalid Credentials');
        }
        const verifyResult = await Hash.compare(password, user.password);

        // invalid password
        if (!verifyResult) {
            this.logger.debug(`Invalid Password for user: ${identifier}`);
            throw new AuthenticationError('Invalid Credentials');
        }

        return user;
    }

    async changePassword(
        changePasswordRequest: ChangePasswordRequest,
        user: User,
    ): Promise<boolean> {
        return this.userService.changeOwnPassword(changePasswordRequest, user);
    }

    async logout(user: User): Promise<boolean> {
        const result = await AccessToken.createQueryBuilder('access_token')
            .where('userId = :userId and userType = :userType', { userId: user.id, userType: 'user' })
            .update({ isRevoked: true })
            .execute();

        return result.affected > 0;
    }
}
