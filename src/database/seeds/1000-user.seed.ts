import { Factory, Seeder } from 'typeorm-seeding';
import { User } from 'src/modules/user/models/user.model';
import { Role } from 'src/modules/permission/models/role.model';

export default class UserSeed implements Seeder {
    public async run(factory: Factory): Promise<void> {
        const user = await factory(User)().create({
            firstName: 'Codeblock',
            middleName: null,
            lastName: 'Admin',
            email: 'apps@codeblock.co.tz',
            phone: '255755181960',
        });

        const admin = await Role.findOne({ where: { name: 'ADMIN' } });
        user.role = admin;
        user.save();

        await factory(User)()
            .map(async (user: User) => {
                user.role = admin;

                return user;
            })
            .createMany(30);
    }
}
