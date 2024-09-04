import React, { useEffect } from "react";
import { Creator, CreatorId } from "./creatorTypes";
import { useAddCreatorByNameMutation } from "./creatorsApi";

interface AddCreatorMenuProps {
    creatorList: Creator[];
    updateCreatorList: React.Dispatch<React.SetStateAction<Creator[]>>;
    setSelectedCreator: React.Dispatch<React.SetStateAction<CreatorId>>;
}

const AddCreatorMenu = (props : AddCreatorMenuProps) => {

    const [triggerAddCreator, newCreator] = useAddCreatorByNameMutation();

    const handleAddCreator = async () => {

        const nameInput = document.getElementById('creatorName') as HTMLInputElement;
        if (nameInput) {
            const name = nameInput.value;
            if (!name || name.length == 0) return;
    
            await triggerAddCreator(name);
        }
    }

    useEffect(()=>{
        if (newCreator.data) {
            props.updateCreatorList([...props.creatorList,newCreator.data])
            props.setSelectedCreator(newCreator.data._id);
        }
    },[newCreator])

    return (
        <div className="addCreatorMenu">
            <input id="creatorName" type="text" placeholder="Creator name..."></input>
            <button onClick={handleAddCreator} type="button" value="Add creator">Submit</button>
        </div>
    )
}

export default AddCreatorMenu;