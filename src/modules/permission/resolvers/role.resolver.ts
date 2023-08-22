import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from '../models/role.model';
import { PermissionService } from '../providers/permission.service';
import { AssignPermissionsDto } from '../dtos/assign-permissions.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { UserTypeGuard } from '../guards/user-type.guard';

@Resolver(() => Role)
@UseGuards(GqlAuthGuard)
export class RoleResolver {
    constructor(private readonly permissionService: PermissionService) {}

    @Mutation(() => Role)
    @UseGuards(UserTypeGuard)
    async assignPermissionsToRole(
        @Args('input') input: AssignPermissionsDto,
    ): Promise<Role> {
        const role = await this.permissionService.assignPermissionToRoles(
            input,
        );
        return role;
    }
}
