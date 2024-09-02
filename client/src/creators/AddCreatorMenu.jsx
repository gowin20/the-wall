import React from "react";
import { useAppDispatch } from "../hooks";
import { addCreator, listCreators } from "./creatorActions";

const AddCreatorMenu = () => {
    const dispatch = useAppDispatch();

    const handleAddCreator = (e) => {
        const name = document.getElementById('creatorName').value;
        if (!name || name.length == 0) return;

        dispatch(addCreator({name}));
        dispatch(listCreators());
    }

    return (
        <div className="addCreatorMenu">
            <input id="creatorName" type="text" placeholder="Creator name..."></input>
            <button onClick={handleAddCreator} value="Add creator">Submit</button>
        </div>
    )
}

export default AddCreatorMenu;