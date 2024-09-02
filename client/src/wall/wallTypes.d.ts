import type { CreatorId } from "../creators/creatorTypes";

// DB schema objects

export type DziId = string | null; // Corresponds to a Note _id in mongo
export type NoteId = string | null; // Corresponds to a Layout _id in mongo
export type LayoutId = string | null; // Corresponds to a DZI _id in mongo


// TODO figure out a type for S3 URLs with the URL class https://developer.mozilla.org/en-US/docs/Web/API/URL

export interface DziObject {
    _id: DziId;
    name: string;
    Image: {
        Url: string;
        xmlns: "http://schemas.microsoft.com/deepzoom/2008";
        Format: "jpeg" | "jpg" | "png" | "tif";
        Overlap: number;
        TileSize: number;
        Size: {
            Height: number;
            Width: number;
        }
    }
}

export interface LayoutObject {
    _id: LayoutId; 
    name: string | null;
    array: Array<Array<string>>;
    image: DziId; 
    noteImageSize: number;
    numCols: number;
    numRows: number;
    default: boolean;
}

export interface NoteObject extends NoteInfo {
    _id: NoteId; 
    orig: string; // URL of full size PNG
    thumbnails: Record<string, string>; // Object containing URLs of thumbnails at different resolutions
    tiles: DziId;
    thumb: string | null; // Deprecated property TODO remove from DB
}

export interface NoteInfo {
    creator: CreatorId; // ID of creator
    title: string | null; // Title given to note by creator
    details: string | null; // Any details or description provided
    location: string | null; // Location of creation
    date: string | null; // Date of creation
}