import React from "react";
import { useAppDispatch } from "../hooks";
import { addCreator, listCreators } from "./creatorActions";
import { Creator } from "./creatorTypes";
import { useLazyAddCreatorByNameQuery } from "./creatorsApi";

interface AddCreatorMenuProps {
    creatorList: Creator[];
    updateCreatorList: React.Dispatch<React.SetStateAction<Creator[]>>;
}

const AddCreatorMenu = (props : AddCreatorMenuProps) => {
    //const dispatch = useAppDispatch();

    const [triggerAddCreator, newCreatorResponse, lastPromiseInfo] = useLazyAddCreatorByNameQuery();

    const handleAddCreator = async () => {
        const nameInput = document.getElementById('creatorName') as HTMLInputElement;
        if (nameInput) {
            const name = nameInput.value;
            if (!name || name.length == 0) return;
    
            //dispatch(addCreator({name}));
            //dispatch(listCreators());
            await triggerAddCreator(name);
            console.log(newCreatorResponse)
            if (newCreatorResponse.meta)
            props.updateCreatorList([...props.creatorList, newCreatorResponse])
        }
    }

    return (
        <div className="addCreatorMenu">
            <input id="creatorName" type="text" placeholder="Creator name..."></input>
            <button onClick={handleAddCreator} value="Add creator">Submit</button>
        </div>
    )
}

export default AddCreatorMenu;