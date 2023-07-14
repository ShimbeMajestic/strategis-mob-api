import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-express';
import * as moment from 'moment';
import { authConfig } from 'src/config/auth.config';
import { JwtPayload } from '../jwt-payload.interface';
import { AccessToken } from '../models/access-token.model';
import { AuthenticatedUser } from '../models/authenticated-user.interface';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/user/models/user.model';
import { Customer } from 'src/modules/customer/models/customer.model';

@Injectable()
export class AccessTokenService {
    protected readonly logger = new Logger('AccessTokenService');

    constructor(
        protected readonly jwtService: JwtService,
        protected readonly dataSource: DataSource,
    ) {}

    async validateAccessToken(tokenId: string): Promise<AuthenticatedUser> {
        if (!tokenId)
            throw new AuthenticationError(
                'Authentication error! No access token provided.',
            );

        const token = await AccessToken.findOne({
            where: {
                id: tokenId,
                isRevoked: false,
            },
            // relations: ['user']
        });

        if (!token)
            throw new AuthenticationError('Session expired! Please login.');

        let user = null;
        switch (token.userType) {
            case 'user':
                user = User.findOne({
                    where: { id: token.userId },
                });
                break;

            case 'customer':
                user = Customer.findOne({
                    where: { id: token.userId },
                });
                break;

            default:
                throw new Error('Invalid user type');
        }

        if (!user)
            throw new AuthenticationError('Session expired! Please login.');

        return user;
    }

    async generateToken(user: AuthenticatedUser): Promise<string> {
        // Issue new token
        const token = new AccessToken();
        token.userId = user.id;
        token.userType = user.type;
        token.expiresAt = moment().add(authConfig.tokenLife, 'second').toDate();
        await token.save();

        // create signed JWT
        const payload: JwtPayload = {
            jti: token.id,
            sub: `${token.userType}:${user.id}`,
        };

        const options: JwtSignOptions = {
            expiresIn: authConfig.tokenLife,
        };

        const accessToken: string = await this.jwtService.sign(
            payload,
            options,
        );

        // return signed JWT
        return accessToken;
    }
}
