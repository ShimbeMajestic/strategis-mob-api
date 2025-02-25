<<<<<<< HEAD
/* defines a graphql resolver for handling insurance claims while enforcing authentication using authentication guard*/
import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
=======
import { Query, Resolver } from '@nestjs/graphql';
>>>>>>> 1a445934da4b350261b65a0c2e25edaaf5a011c3
import { Claim } from '../models/claim.model';
import { AllowUserType } from 'src/modules/permission/decorators/user-type.decorator';
import { UserTypeEnum } from 'src/modules/permission/enums/user-type.enum';

<<<<<<< HEAD
@Resolver(() => Claim)/* tells netsjs that this class handles graphql operations for claim entity*/
@UseGuards(GqlAuthGuard)/* only authorized users can access resolver's functions*/
export class ClaimResolver {/* This class is currently empty but will later include mutations (for creating/updating claims) and queries (for fetching claims).
*/
  constructor() {} 
=======
@Resolver()
export class ClaimResolver {
    @Query(() => [Claim])
    @AllowUserType(UserTypeEnum.ADMIN)
    async allClaims(): Promise<Claim[]> {
        return await Claim.find({
            order: {
                id: 'DESC',
            },
        });
    }
>>>>>>> 1a445934da4b350261b65a0c2e25edaaf5a011c3
}
