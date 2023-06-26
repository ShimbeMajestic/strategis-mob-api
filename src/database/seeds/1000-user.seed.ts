import { User } from 'src/modules/user/models/user.model';
import { Role } from 'src/modules/permission/models/role.model';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeed implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) {}

    async onModuleInit() {
        await this.run();
    }

    public async run(): Promise<void> {
        const user = this.userRepository.create({
            firstName: 'Codeblock',
            middleName: null,
            lastName: 'Admin',
            email: 'apps@codeblock.co.tz',
            phone: '255755181960',
            password: 'password@1',
        });

        const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
        user.role = adminRole;
        user.save();

        const usersToCreate = 30;
        const users = Array.from({
            length: usersToCreate,
        }).map(() => {
            const newUser = this.userRepository.create();
            newUser.role = adminRole;
            return newUser;
        });
        await this.userRepository.save(users);
    }
}
