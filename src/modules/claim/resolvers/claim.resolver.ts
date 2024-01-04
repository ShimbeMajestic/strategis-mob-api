import { Query, Resolver } from '@nestjs/graphql';
import { Claim } from '../models/claim.model';
import { AllowUserType } from 'src/modules/permission/decorators/user-type.decorator';
import { UserTypeEnum } from 'src/modules/permission/enums/user-type.enum';

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
}
