import { siteApi } from "../api";
import { CreatorsList,CreatorName, Creator, CreatorId, Username } from "./creatorTypes";

// extraReducers for these functions are in wallSlice.ts
export const creatorsApi = siteApi.injectEndpoints({
    endpoints: (builder) =>({
        getCreatorById: builder.query<Creator,CreatorId>({
            query: (creatorId) => ({
                url:'/users/id/'+creatorId,
                method: 'GET'
            })
        }),
        getCreatorByUsername: builder.query<Creator,Username>({
            query: (username) => ({
                url: '/users/username/'+username,
                method: 'GET'
            })
        }),
        listCreators: builder.query<CreatorsList, null>({
            query: () => ({
                url: '/users',
                method: 'GET'
            })
        }),
        addCreatorByName: builder.mutation<Creator,CreatorName>({
            query: (name) => ({
                url: '/users/addName',
                method: 'POST',
                body: {name}
            })
        })
    })
})

export const {useListCreatorsQuery, useGetCreatorByIdQuery, useAddCreatorByNameMutation} = creatorsApi;