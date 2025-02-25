import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { Claim } from '../models/claim.model';
import { ClaimService } from './claim.service';
import { AllowUserType } from 'src/modules/permission/decorators/user-type.decorator';
import { UserTypeEnum } from 'src/modules/permission/enums/user-type.enum';

// Resolver for handling GraphQL operations related to Claims
@Resolver(() => Claim)
@UseGuards(GqlAuthGuard) // Ensure only authorized users can access resolver methods
export class ClaimResolver {
    constructor(private readonly claimService: ClaimService) {} // Injecting ClaimService

    // Query to get all claims, accessible only by admins
    @Query(() => [Claim])
    @AllowUserType(UserTypeEnum.ADMIN)
    async allClaims(): Promise<Claim[]> {
        return await this.claimService.allClaims(); // Retrieve all claims from the service
    }

    // Mutation to create a new claim, accessible only by admins
    @Mutation(() => Claim)
    @AllowUserType(UserTypeEnum.ADMIN)
    async createClaim(@Args('claimData') claimData: Partial<Claim>): Promise<Claim> {
        return await this.claimService.createClaim(claimData); // Create and return the new claim
    }

    // Mutation to update an existing claim, accessible only by admins
    @Mutation(() => Claim)
    @AllowUserType(UserTypeEnum.ADMIN)
    async updateClaim(
        @Args('claimId') claimId: number, // Claim ID to update
        @Args('updateData') updateData: Partial<Claim>, // New data for the claim
    ): Promise<Claim> {
        return await this.claimService.updateClaim(claimId, updateData); // Update and return the claim
    }

    // Mutation to delete a claim, accessible only by admins
    @Mutation(() => String)
    @AllowUserType(UserTypeEnum.ADMIN)
    async deleteClaim(@Args('claimId') claimId: number): Promise<string> {
        const result = await this.claimService.deleteClaim(claimId); // Delete the claim
        return result.message; // Return success message
    }
}
