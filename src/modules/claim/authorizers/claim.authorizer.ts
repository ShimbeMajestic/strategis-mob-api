/* In practice, this page does the following: 
If a customer requests claim data, they only see their own claims.
Other user types (e.g., admins) can access all claims.
The authorization rules are enforced at the query level, so users only retrieve the data they are allowed to see.*/
import { Filter } from '@nestjs-query/core';
import {
  AuthorizationContext,
  CustomAuthorizer,
} from '@nestjs-query/query-graphql/dist/src/auth/authorizer';
import { Injectable } from '@nestjs/common';
import { UserContext } from 'src/modules/auth/models/authenticated-user.interface';
import { Claim } from '../models/claim.model';

@Injectable()
export class ClaimAuthorizer implements CustomAuthorizer<Claim> {
  /**
   * Authorizes access to Claim records based on user type.
   * If the user is a customer, they can only access claims where customerId matches their ID.
   * Otherwise, there are no restrictions.
   */
  authorize(
    context: UserContext,
    authorizerContext: AuthorizationContext,
  ): Promise<Filter<Claim>> {
    // If the user is a customer, return a filter that restricts claims to their own.
    if (context.req.user.type === 'customer')
      return Promise.resolve({ customerId: { eq: context.req.user.id } });
    
    // If the user is not a customer, return an empty filter (no restrictions).
    else return Promise.resolve({});
  }
  
  /**
   * Defines authorization rules for related entities.
   * Currently, it allows unrestricted access to related data.
   */
  authorizeRelation?(
    relationName: string,
    context: UserContext,
    authorizerContext: AuthorizationContext,
  ): Promise<Filter<unknown>> {
    // No restrictions on related data.
    return Promise.resolve({});
  }
}
