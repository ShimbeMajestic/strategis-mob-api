import { faker } from '@faker-js/faker';
import { User } from 'src/modules/user/models/user.model';
import { GenderEnum } from 'src/modules/lists/enums/gender.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserFactory {
    public generate(): User {
        const gender = faker.number.int(1) === 1 ? 'male' : 'female';
        const firstName = faker.person.firstName(gender);
        const lastName = faker.person.lastName(gender);
        // set middlename as null 50% of the time
        const middleName =
            faker.number.int(1) === 1 ? null : faker.person.lastName(gender);
        const username = lastName.substr(0, 4) + firstName.substr(0, 1) + '001';

        const user = new User();
        user.workID = username.toLowerCase();
        user.firstName = firstName;
        user.middleName = middleName;
        user.lastName = lastName;
        user.gender =
            Number(gender) === 1 ? GenderEnum.MALE : GenderEnum.FEMALE;
        user.email = faker.internet
            .email({ firstName, lastName, provider: 'codeblock.co.tz' })
            .toLocaleLowerCase();
        user.phone = faker.phone.number('+255 6/7# ### ####');
        user.address = faker.location.streetAddress({ useFullAddress: true });
        user.password = 'password@1'; // password@1

        user.save();

        return user;
    }
}
