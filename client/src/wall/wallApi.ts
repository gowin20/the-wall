import { siteApi } from "../api";
import { DziId, DziObject, LayoutObject } from "./wallTypes";

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
        })
    })
})

export const {useGetDefaultLayoutQuery, useGetZoomableImageQuery} = wallApi;