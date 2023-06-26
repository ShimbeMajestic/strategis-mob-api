import { Role } from 'src/modules/permission/models/role.model';
import { GuardType } from 'src/modules/permission/models/guard-type.enum';
import { Permission } from 'src/modules/permission/models/permission.model';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeed implements OnModuleInit {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
    ) {}

    async onModuleInit() {
        await this.run();
    }

    public async run(): Promise<void> {
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

        const permissionModels: Permission[] = [];
        for (const permission of permissions) {
            const row = this.permissionRepository.create({
                name: permission,
                guard: GuardType.ADMIN,
            });

            const permissionModel = await row.save();
            permissionModels.push(permissionModel);
        }

        const admin = this.rolesRepository.create({
            name: 'ADMIN',
            guard: GuardType.ADMIN,
        });

        admin.permissions = permissionModels;
        await admin.save();

        const wareHouse = this.rolesRepository.create({
            name: 'WARE_HOUSE',
            guard: GuardType.ADMIN,
        });
        wareHouse.save();
    }
}
