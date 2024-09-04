import React, { useEffect, useState } from "react";
import './creators.css';
import AddCreatorMenu from "./AddCreatorMenu";
import { useListCreatorsQuery } from "./creatorsApi";
import type {Creator} from './creatorTypes';

const CreatorSelector = ({creatorId}) => {
    const [selectedCreator,setCreator] = useState(creatorId);
    const [creatorList, setCreatorList] = useState<Creator[]>([]);
    const {data, isFetching, isLoading} = useListCreatorsQuery(null);

    useEffect(()=>{
        if (data) setCreatorList([...data]);
    },[data])

    if (isFetching || selectedCreator == null) return <></>;

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