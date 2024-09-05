import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { siteApi } from "../api";
import { DziId, DziObject, LayoutObject, NoteId, NoteObject,NoteInfo, LayoutId } from "./wallTypes";
interface NoteUpdate {
    noteId: NoteId;
    info: NoteInfo
}
interface QueryResponse<C> {
    error:FetchBaseQueryError | null;
    data:C
}
type DziResult = DziObject | null;

export const wallApi = siteApi.injectEndpoints({
    endpoints: (builder) => ({
        getDefaultLayout: builder.query<LayoutObject,null>({
            query: () => ({
                url:'/layouts/default',
                method:'GET'
            })
        }),
        getLayout: builder.query<LayoutObject, LayoutId>({
            query: (layoutId) => ({
                url:'/layouts/id/'+layoutId,
                method:'GET'
            })
        }),
        getZoomableImage: builder.query<DziResult,DziId>({
            query: (dziId) => ({
                url:'/dzis/id/'+dziId,
                method:'GET'
            })
        }),
        getNote: builder.query<NoteObject,NoteId>({
            query: (noteId) => ({
                url: '/notes/id/'+noteId,
                method:'GET'
            })
        }),
        patchNote: builder.mutation<null,NoteUpdate>({
            query: ({noteId,info})=>({
                url:'/notes/id/'+noteId,
                method:'PATCH',
                body:info
            })
        })
    })
})

export const {useGetDefaultLayoutQuery, useGetLayoutQuery, useGetZoomableImageQuery, usePatchNoteMutation} = wallApi;