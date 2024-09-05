import {SERVER_DOMAIN} from '../config.ts';

export const getNote = async (id) => {

    const response = await fetch(SERVER_DOMAIN+'/notes/id/'+id);
    if (response.status == 200) {
        const noteObj = await response.json();
        return noteObj;
    }
}