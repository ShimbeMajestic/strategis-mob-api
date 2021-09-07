import { User } from "src/modules/user/models/user.model";
import { Permission } from "../models/permission.model";
import { Role } from "../models/role.model";


export class PermissionService {

    static async userPermissionGrants(userId: number): Promise<Permission[]> {

        // re-select the user
        const user = await User.findOne({
            relations: ['permissions'],
            where: { id: userId },
        });

        if (!user) {
            return []; // return empty permissions if user not found
        }

        const directPermissions = user.permissions;

        const role = await Role.findOne({
            relations: ['permissions'],
            where: { id: user.roleId },
        });

        const rolePermissions = role ? role.permissions : [];

        const permissions = [...new Set([...directPermissions, ...rolePermissions])]

        return permissions;
    }
}
