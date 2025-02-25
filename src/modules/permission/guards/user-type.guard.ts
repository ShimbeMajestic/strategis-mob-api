import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ForbiddenError } from '@nestjs/apollo';
import { Role } from '../models/role.model';

@Injectable()
export class UserTypeGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);

        // Gets Anotations defined on method level
        const userTypesFromHandler =
            this.reflector.get<string[] | string>(
                'userTypes',
                context.getHandler(),
            ) || [];

        // Gets Anotations defined on Controller/Resolver class level
        const userTypeFromClass =
            this.reflector.get<string[] | string>(
                'userTypes',
                context.getClass(),
            ) || [];

        // merge all types defined
        const userTypes = [] as string[];

        if (typeof userTypesFromHandler === 'string') {
            userTypes.push(userTypesFromHandler);
        } else {
            userTypes.push(...userTypesFromHandler);
        }

        if (userTypeFromClass === 'string') {
            userTypes.push(userTypeFromClass);
        } else {
            userTypes.push(...userTypeFromClass);
        }

        // Get user
        const request = ctx.getContext().req;
        const user = request.user;

        // fetch current user role
        const currentUserRole = await Role.findOne({
            where: {
                id: user.roleId,
            },
        });

        for (const roleType of userTypes) {
            // Return failure on first missing permission
            if (currentUserRole.name === roleType) {
                throw new ForbiddenError(
                    `Forbidden! Role type '${roleType.toUpperCase()}' is required to access this resource`,
                );
            }
        }

        return true;
    }
}
