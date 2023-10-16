import { useDispatch, useSelector } from "react-redux";
import { listCreators } from "./creatorActions";
import React, { useEffect, useState } from "react";
import './creators.css';
const CreatorSelector = ({value}) => {
    const [selectedCreator,setCreator] = useState(value !== "" ? value : '64f3db0f831d677c80b1726c');
    const creatorList = useSelector(state=>state.creators.creatorList);
    const dispatch = useDispatch();
    // TODO only use this when expanding the thing
    useEffect(()=>{
        if (!creatorList.loaded) dispatch(listCreators());
    },[])

    useEffect(()=>{
        setCreator(value !== "" ? value : '64f3db0f831d677c80b1726c')
    },[value])

    if (!creatorList.loaded || selectedCreator == null) return <></>;

    // If value is null, default to "Unknown"
    
    const options = creatorList.items.map(creator=> { return <option key={creator._id} value={creator._id}>{creator.name}</option>
    })

    return (
        <select key={selectedCreator} className="creatorSelector" value={selectedCreator} onChange={e=>setCreator(e.target.value)}>
            {options}
        </select>
    )
}

export default CreatorSelector;