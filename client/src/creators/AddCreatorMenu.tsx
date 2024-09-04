import React, { useEffect } from "react";
import { Creator } from "./creatorTypes";
import { useLazyAddCreatorByNameQuery } from "./creatorsApi";

interface AddCreatorMenuProps {
    creatorList: Creator[];
    updateCreatorList: React.Dispatch<React.SetStateAction<Creator[]>>;
}

const AddCreatorMenu = (props : AddCreatorMenuProps) => {

    const [triggerAddCreator, newCreator] = useLazyAddCreatorByNameQuery();

    const handleAddCreator = async () => {
        const nameInput = document.getElementById('creatorName') as HTMLInputElement;
        if (nameInput) {
            const name = nameInput.value;
            if (!name || name.length == 0) return;
    
            await triggerAddCreator(name);
        }
    }

    useEffect(()=>{
        if (newCreator.data) props.updateCreatorList([...props.creatorList,newCreator.data])
    },[newCreator])

    return (
        <div className="addCreatorMenu">
            <input id="creatorName" type="text" placeholder="Creator name..."></input>
            <button onClick={handleAddCreator} value="Add creator">Submit</button>
        </div>
    )
}

export default AddCreatorMenu;