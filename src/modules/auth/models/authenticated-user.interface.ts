import { UserType } from './user-type';

export interface AuthenticatedUser {
    id: number;

    readonly type: UserType;
}

export type UserContext = {
    req: {
        user: AuthenticatedUser;
    };
};