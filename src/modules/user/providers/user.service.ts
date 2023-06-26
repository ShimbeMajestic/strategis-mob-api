import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { User } from '../models/user.model';
import { UserUpdatePasswordInput } from '../dto/user-update-password.dto';
import { Hash } from 'src/shared/helpers/hash.helper';
import { ChangePasswordRequest } from 'src/modules/auth/dto/change-password-request.dto';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
    async changeOwnPassword(
        changePasswordRequest: ChangePasswordRequest,
        user: User,
    ): Promise<boolean> {
        const validateCurrentPassword = await Hash.compare(
            changePasswordRequest.currentPassword,
            user.password,
        );

        // validate current password
        if (!validateCurrentPassword) {
            throw new UnauthorizedException(
                'Invalid current password provided!',
            );
        }

        return this.changePassword(changePasswordRequest, user);
    }

    async changePassword(
        changePasswordRequest: UserUpdatePasswordInput,
        targetUser: User | number,
    ): Promise<boolean> {
        if (typeof targetUser === 'number') {
            targetUser = await User.findOneOrFail(
                targetUser as FindOneOptions<User>,
            );
        }

        // Validate password confirmation
        if (
            changePasswordRequest.newPassword !==
            changePasswordRequest.newPasswordConfirmation
        ) {
            throw new BadRequestException(
                'Password confirmation mismatch! Provided password and password confirmation did not match.',
            );
        }

        targetUser.password = await Hash.make(
            changePasswordRequest.newPassword,
        );
        targetUser.save();

        return true;
    }
}
