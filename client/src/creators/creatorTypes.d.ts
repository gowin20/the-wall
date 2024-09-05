import { LayoutId } from "../wall/wallTypes";

export type CreatorId = string | null;

export type CreatorName = string;

export type Username = string;

export interface UserObject extends CreatorObject {
    username: string | null,
    password: string | null;
    email: string | null;
    isAdmin: boolean | null;
}

export interface CreatorObject {
    _id: CreatorId;
    name: CreatorName;
    registered: boolean;
    layout: LayoutId;
}

export type Creator = UserObject | CreatorObject;

export type CreatorsList = Array<Creator>;

