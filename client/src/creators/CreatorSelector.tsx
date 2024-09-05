import React, { useEffect, useState } from "react";
import './creators.css';
import AddCreatorMenu from "./AddCreatorMenu";
import { useListCreatorsQuery } from "./creatorsApi";
import type {Creator,CreatorId} from './creatorTypes';
import { NoteInfo } from "../wall/wallTypes";

interface CreatorSelectorProps {
    creatorId: CreatorId;
    currentDetails: NoteInfo;
    updateDetails: React.Dispatch<React.SetStateAction<NoteInfo>>
}

const CreatorSelector = ({creatorId,currentDetails,updateDetails} : CreatorSelectorProps) => {
    const [selectedCreator,setSelectedCreator] = useState<CreatorId>(creatorId);
    const [creatorList, setCreatorList] = useState<Creator[]>([]);
    const {data, isFetching, isLoading} = useListCreatorsQuery(null);

    useEffect(()=>{
        updateDetails({...currentDetails, creator:selectedCreator})
    },[selectedCreator])

    useEffect(()=>{
        setSelectedCreator(creatorId);
    },[creatorId])

    

    useEffect(()=>{
        if (data) setCreatorList([...data]);
    },[data])

    if (isFetching || selectedCreator == null) return <></>;

    const creators = creatorList.map(creator=> { return <option key={creator._id} value={creator._id ? creator._id : ''}>{creator.name}</option>})

    const addCreator = <option key='newCreator' value='newCreator'>+ Add creator...</option>

    const options = [...creators, addCreator];

    let creatorMenu = <></>;
    if (selectedCreator == 'newCreator') creatorMenu = <AddCreatorMenu creatorList={creatorList} updateCreatorList={setCreatorList} setSelectedCreator={setSelectedCreator}/>;

    return (
        <>
        {creatorMenu}
        <select key={selectedCreator} className="creatorSelector" value={selectedCreator} onChange={e=>setSelectedCreator(e.target.value)}>
            {options}
        </select>
        </>
    )
}

export default CreatorSelector;