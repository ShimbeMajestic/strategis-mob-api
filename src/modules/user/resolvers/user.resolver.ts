import {
    Resolver,
    Args,
    Mutation,
    Int,
    Parent,
    ResolveField,
} from '@nestjs/graphql';
import { User } from '../models/user.model';
import { UserService } from '../providers/user.service';
import { UserUpdatePasswordInput } from '../dto/user-update-password.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { Permission } from 'src/modules/permission/models/permission.model';
import { PermissionService } from 'src/modules/permission/providers/permission.service';

// @UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => Boolean)
    updateUserPassword(
        @Args({ name: 'id', type: () => Int }) targetUserId: number,
        @Args('input') updatePasswordInput: UserUpdatePasswordInput,
    ): Promise<boolean> {
        return this.userService.changePassword(
            updatePasswordInput,
            targetUserId,
        );
    }

    // permission grants
    @ResolveField(() => [Permission], {
        description: 'Get User Permission Grants. ',
    })
    @UseGuards(GqlAuthGuard)
    permissionGrants(@Parent() user: User): Promise<Permission[]> {
        return PermissionService.userPermissionGrants(user.id);
    }
}
