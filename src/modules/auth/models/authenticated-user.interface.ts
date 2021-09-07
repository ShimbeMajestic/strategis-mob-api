import { UserType } from './user-type';

export interface AuthenticatedUser {
    id: number;

    readonly type: UserType;
}
