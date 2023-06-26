import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-express';
import * as moment from 'moment';
import { authConfig } from 'src/config/auth.config';
import { JwtPayload } from '../jwt-payload.interface';
import { AccessToken } from '../models/access-token.model';
import { AuthenticatedUser } from '../models/authenticated-user.interface';
import { userType } from '../models/user-type';
import { getRepository } from 'typeorm';

@Injectable()
export class AccessTokenService {
    protected readonly logger = new Logger('AccessTokenService');

    constructor(protected readonly jwtService: JwtService) {}

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

        // Retrieve user by type: customer/user
        const userRepository = getRepository(userType[token.userType]);

        const user = userRepository.findOne({
            where: { id: token.userId },
        });

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
