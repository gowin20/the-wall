import { LayoutId } from "../wall/wallTypes";

export type CreatorId = string | null;

export interface UserObject extends CreatorObject {
    username: string | null,
    password: string | null;
    email: string | null;
    isAdmin: boolean | null;
}

export interface CreatorObject {
    id: CreatorId;
    name: string;
    registered: boolean;
    layout: LayoutId;
}