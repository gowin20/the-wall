import { useAppDispatch,useAppSelector } from "../hooks";
import { listCreators } from "./creatorActions";
import React, { useEffect, useState } from "react";
import './creators.css';
import AddCreatorMenu from "./AddCreatorMenu";
import { useListCreatorsQuery } from "./creatorsApi";
import type {Creator} from './creatorTypes';

const CreatorSelector = ({value}) => {
    const [selectedCreator,setCreator] = useState(value !== "" ? value : '64f3db0f831d677c80b1726c');
    const [creatorList, setCreatorList] = useState<Creator[]>([]);
    //const creatorList = useAppSelector(state=>state.creators.creatorList);

    const {data, isFetching, isLoading} = useListCreatorsQuery(null);

    useEffect(()=>{
        setCreator(value !== "" ? value : '64f3db0f831d677c80b1726c')
    },[value])

    useEffect(()=>{
        if (data) setCreatorList([...data]);
    },[isFetching])

    if (isFetching || selectedCreator == null) return <></>;

    // If value is null, default to "Unknown"
    //console.log(data);
    const creators = creatorList.map(creator=> { return <option key={creator._id} value={creator._id ? creator._id : ''}>{creator.name}</option>})

    const addCreator = <option key='newCreator' value='newCreator'>+ Add creator...</option>

    const options = [...creators, addCreator];

    let creatorMenu = <></>;
    if (selectedCreator == 'newCreator') creatorMenu = <AddCreatorMenu creatorList={creatorList} updateCreatorList={setCreatorList} />;

    return (
        <>
        {creatorMenu}
        <select key={selectedCreator} className="creatorSelector" value={selectedCreator} onChange={e=>setCreator(e.target.value)}>
            {options}
        </select>
        </>
    )
}

export default CreatorSelector;