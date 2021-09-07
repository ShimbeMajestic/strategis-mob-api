import { Seeder } from 'typeorm-seeding';
import { Role } from 'src/modules/permission/models/role.model';
import { GuardType } from 'src/modules/permission/models/guard-type.enum';
import { Permission } from 'src/modules/permission/models/permission.model';

export default class RoleSeed implements Seeder {
    public async run(): Promise<void> {
        const permissions = [
            'manage users',
            'view users',
            'manage customers',
            'view customers',
            'view settings',
            'manage settings',
            'view products',
            'manage products',
            'view campaigns',
            'manage campaigns',
            'view orders',
            'manage orders',
            'view roles',
            'manage roles',
            'view permissions',
        ];

        const permissionModels: Permission[] = [];
        for (const permission of permissions) {
            const row = Permission.create({
                name: permission,
                guard: GuardType.ADMIN,
            });

            const permissionModel = await row.save();
            permissionModels.push(permissionModel);
        }

        const admin = Role.create({
            name: 'ADMIN',
            guard: GuardType.ADMIN,
        });

        admin.permissions = permissionModels;
        await admin.save();

        const wareHouse = Role.create({
            name: 'WARE_HOUSE',
            guard: GuardType.ADMIN,
        });
        wareHouse.save();
    }
}
