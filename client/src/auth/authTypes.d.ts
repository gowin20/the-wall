import { UserObject } from '../creators/creatorTypes';
export type AuthToken = string | null | undefined;

export interface VerifyLoginResponse {
    message: string | null;
    isLoggedIn: boolean;
    userInfo: UserObject | null;
}

export interface LoginResponse {
    message: string | null;
    isLoggedIn: boolean;
    userInfo: UserObject | null;
    token: AuthToken | null;
}

interface LoginParams {
    username:string;
    password:string;
}