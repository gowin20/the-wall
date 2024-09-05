import { siteApi } from "../api";
import { CreatorsList,CreatorName, Creator, CreatorId } from "./creatorTypes";

export const creatorsApi = siteApi.injectEndpoints({
    endpoints: (builder) =>({
        listCreators: builder.query<CreatorsList, null>({
            query: () => ({
                url: '/users',
                method: 'GET'
            })
        }),
        getCreatorById: builder.query<Creator,CreatorId>({
            query: (creatorId) => ({
                url:'/users/id/'+creatorId,
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