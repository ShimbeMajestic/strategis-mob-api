/* defines a graphql resolver for handling insurance claims while enforcing authentication using authentication guard*/
import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { Claim } from '../models/claim.model';

@Resolver(() => Claim)/* tells netsjs that this class handles graphql operations for claim entity*/
@UseGuards(GqlAuthGuard)/* only authorized users can access resolver's functions*/
export class ClaimResolver {/* This class is currently empty but will later include mutations (for creating/updating claims) and queries (for fetching claims).
*/
  constructor() {} 
}
