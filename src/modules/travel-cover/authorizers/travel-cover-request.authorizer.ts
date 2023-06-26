import { Filter } from '@ptc-org/nestjs-query-core';
import {
  AuthorizationContext,
  CustomAuthorizer,
} from '@ptc-org/nestjs-query-graphql';
import { Injectable } from '@nestjs/common';
import { UserContext } from 'src/modules/auth/models/authenticated-user.interface';
import { TravelCoverRequest } from '../models/travel-cover-request.model';

@Injectable()
export class TravelCoverRequestAuthorizer
  implements CustomAuthorizer<TravelCoverRequest>
{
  authorize(
    context: UserContext,
    authorizerContext: AuthorizationContext,
  ): Promise<Filter<TravelCoverRequest>> {
    if (context.req.user.type === 'customer')
      return Promise.resolve({ customerId: { eq: context.req.user.id } });
    else return Promise.resolve({});
  }
  authorizeRelation?(
    relationName: string,
    context: UserContext,
    authorizerContext: AuthorizationContext,
  ): Promise<Filter<unknown>> {
    return Promise.resolve({});
  }
}
