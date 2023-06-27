import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/user/models/user.model';
import { Role } from 'src/modules/permission/models/role.model';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
        const repository = dataSource.getRepository(User);
        await repository.create([
            {
                firstName: 'Caleb',
                middleName: null,
                lastName: 'Barrows',
                email: 'apps@codeblock.co.tz',
                phone: '255755181960',
                password: 'password@1',
                role: adminRole,
            },
        ]);

        // ---------------------------------------------------

        const userFactory = await factoryManager.get(User);
        // save 1 factory generated entity, to the database
        await userFactory.saveMany(5);
    }
}
