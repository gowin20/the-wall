import { useDispatch, useSelector } from "react-redux";
import { listCreators } from "./creatorActions";
import React, { useEffect, useState } from "react";
const CreatorSelector = ({value}) => {
    const creatorList = useSelector(state=>state.creators.creatorList);
    const dispatch = useDispatch();
    // TODO only use this when expanding the thing
    useEffect(()=>{
        if (!creatorList.loaded) dispatch(listCreators());
    },[])

    if (!creatorList.loaded) return <></>;

    // If value is null, default to "Unknown"
    const selectedUser = (value) ? value : '64f3db0f831d677c80b1726c';
    
    const options = creatorList.items.map(creator=> { return <option key={creator._id} value={creator._id}>{creator.name}</option>
    })

    return (
        <select key={selectedUser} className="creatorSelector" defaultValue={selectedUser}>
            {options}
        </select>
    )
}

export default CreatorSelector;