import { Customer } from 'src/modules/customer/models/customer.model';
import { User } from 'src/modules/user/models/user.model';

export const userType = {
    user: User,
    customer: Customer,
};

export type UserType = keyof typeof userType;
