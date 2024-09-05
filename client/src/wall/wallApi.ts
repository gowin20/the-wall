import { siteApi } from "../api";
import { DziId, DziObject, LayoutObject, NoteId, NoteObject,NoteInfo } from "./wallTypes";
interface NoteUpdate {
    noteId: NoteId;
    info: NoteInfo
} 
export const wallApi = siteApi.injectEndpoints({
    endpoints: (builder) => ({
        getDefaultLayout: builder.query<LayoutObject,null>({
            query: () => ({
                url:'/layouts/default',
                method:'GET'
            })
        }),
        getZoomableImage: builder.query<DziObject,DziId>({
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

export const {useGetDefaultLayoutQuery, useGetZoomableImageQuery, useGetNoteQuery,usePatchNoteMutation} = wallApi;