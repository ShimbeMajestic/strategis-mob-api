import { Catch, BadRequestException, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(BadRequestException)
export class GqlBadRequestHandler implements GqlExceptionFilter {
    catch(exception: HttpException) {
        const response = exception.getResponse() as GraphQLError;

        const message =
            typeof response.message === 'string'
                ? response.message
                : response.message[0];

        return new GraphQLError(message);
    }
}
