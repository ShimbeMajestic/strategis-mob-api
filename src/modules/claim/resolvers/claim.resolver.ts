import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { Claim } from '../models/claim.model';

@Resolver(() => Claim)
@UseGuards(GqlAuthGuard)
export class ClaimResolver {
  constructor() {}
}
