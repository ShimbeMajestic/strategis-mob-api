import { User } from 'src/modules/user/models/user.model';
import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GuardType } from '../models/guard-type.enum';
import { AssignPermissionsDto } from '../dtos/assign-permissions.dto';

export class PermissionService implements OnModuleInit {
    private readonly logger = new Logger(PermissionService.name);

    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}
    async onModuleInit() {
        // Keep database permissions up-to-date
        await this.populatePermissionDb();
    }

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

        const permissions = [
            ...new Set([...directPermissions, ...rolePermissions]),
        ];

        return permissions;
    }

    private async populatePermissionDb() {
        const permissions = [
            'manage users',
            'view users',
            'manage customers',
            'view customers',
            'view settings',
            'manage settings',
            'view roles',
            'manage roles',
            'manage permissions',
            'view permissions',
            'manage cover duration',
            'manager cover types',
        ];

        const dbPermissions = (await this.permissionRepository.find()).map(
            (permission) => permission.name,
        );

        const systemPermissions: string[] = permissions.map(
            (permission) => permission,
        );

        const permissionsToDelete = dbPermissions.filter(
            (e) => !systemPermissions.includes(e),
        );
        const permissionsToCreate = systemPermissions.filter(
            (e) => !dbPermissions.includes(e),
        );

        if (permissionsToDelete.length > 0) {
            this.logger.log(
                'Prunning un-needed permissions: ' +
                    permissionsToDelete.join(','),
            );

            await this.permissionRepository
                .createQueryBuilder()
                .delete()
                .where('name IN (:...permissionsToDelete)', {
                    permissionsToDelete,
                })
                .execute();
        }

        if (permissionsToCreate.length > 0) {
            this.logger.log(
                'Adding missing permissions: ' + permissionsToCreate.join(','),
            );
            for (const permission of permissions) {
                const row = Permission.create({
                    name: permission,
                    guard: GuardType.ADMIN,
                });

                row.save();
            }
        }

        // create admin role if not exists
        let admin = await this.roleRepository.findOne({
            where: {
                name: 'ADMIN',
            },
        });
        if (!admin) {
            this.logger.log('Role Admin not found in DB. System seeding it');

            admin = await this.roleRepository.create({
                name: 'ADMIN',
                guard: GuardType.ADMIN,
            });
        }
        const allPermissions = await this.permissionRepository.find();
        admin.permissions = allPermissions;
        await admin.save();

        // create wareHouse role if not exists
        let wareHouse = await this.roleRepository.findOne({
            where: {
                name: 'WARE_HOUSE',
            },
        });
        if (!wareHouse) {
            this.logger.log(
                'Role WareHouse not found in DB. Sysytem seeding it',
            );

            wareHouse = await this.roleRepository.create({
                name: 'WARE_HOUSE',
                guard: GuardType.ADMIN,
            });
            wareHouse.save();
        }
    }

    async assignPermissionToRoles(input: AssignPermissionsDto): Promise<Role> {
        const role = await this.roleRepository.findOne({
            where: {
                id: input.roleId,
            },
            relations: ['permissions'],
        });

        if (!role) {
            throw new Error('Role not found');
        }

        const permissions = await this.permissionRepository.find({
            where: {
                id: In(input.permissionsIds),
            },
        });

        if (permissions.length !== input.permissionsIds.length) {
            throw new Error('Permission(s) not found');
        }

        role.permissions = permissions;
        await this.roleRepository.save(role);

        return role;
    }
}
