import { User } from 'src/modules/user/models/user.model';
import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { GenderEnum } from 'src/modules/lists/enums/gender.enum';

define(User, (faker: typeof Faker) => {
    const gender = faker.random.number(1);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);
    // set middlename as null 50% of the time
    const middleName =
        faker.random.number(1) === 1 ? null : faker.name.lastName(gender);
    const username = lastName.substr(0, 4) + firstName.substr(0, 1) + '001';

    const user = new User();
    user.workID = username.toLowerCase();
    user.firstName = firstName;
    user.middleName = middleName;
    user.lastName = lastName;
    user.gender = gender === 1 ? GenderEnum.MALE : GenderEnum.FEMALE;
    user.email = faker.internet
        .email(firstName, lastName, 'codeblock.co.tz')
        .toLocaleLowerCase();
    user.phone = faker.phone.phoneNumber();
    user.address = faker.address.streetAddress();
    user.password = 'password@1'; // password@1

    return user;
});
