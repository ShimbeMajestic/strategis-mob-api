import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthenticationError } from '@nestjs/apollo';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();

        return super.canActivate(new ExecutionContextHost([req]));
    }

    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw (
                err || new AuthenticationError('Session expired! Please login.')
            );
        }
        return user;
    }
}
