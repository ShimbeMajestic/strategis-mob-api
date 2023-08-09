import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ForbiddenError } from '@nestjs/apollo';

@Injectable()
export class UserTypeGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);

        // Gets Anotations defined on method level
        const userTypesFromHandler = this.reflector.get<string[] | string>("userTypes", context.getHandler()) || [];

        // Gets Anotations defined on Controller/Resolver class level
        const userTypeFromClass = this.reflector.get<string[] | string>("userTypes", context.getClass()) || [];

        // merge all types defined
        const userTypes = [] as string[];

        if (typeof userTypesFromHandler === 'string') {
            userTypes.push(userTypesFromHandler)
        } else {
            userTypes.push(...userTypesFromHandler);
        }

        if (userTypeFromClass === 'string') {
            userTypes.push(userTypeFromClass)
        } else {
            userTypes.push(...userTypeFromClass);
        }

        // Get user
        const request = ctx.getContext().req;
        const user = request.user;

        if (user) {
            // Returns true if NO userTypes required OR user has any of required userTypes
            const isAllowed = userTypes.length === 0 || userTypes.includes(user.type);

            if (isAllowed) return true;

            // Return failure on first missing permission
            throw new ForbiddenError(`Forbidden! Only user type '${userTypes.join(', ')?.toUpperCase()}' can access this resource`);

        } else {
            return false;
        }
    }
}
