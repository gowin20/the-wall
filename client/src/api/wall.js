import {SERVER_DOMAIN} from '../config.ts';

export const getDefaultLayout = async () => {
    const response = await fetch(SERVER_DOMAIN+'/layouts/default');
    const layout = await response.json();
    return layout;
}

export const getZoomableImage = async (id) => {

    // 1. search DZI collection
    const response = await fetch(SERVER_DOMAIN+'/dzis/id/'+id);
    if (response.status == 200) {
        const dzi = await response.json();
        return dzi;
    }

    // 2. if not found, search IITF collection
}

export const getNote = async (id) => {

    const response = await fetch(SERVER_DOMAIN+'/notes/id/'+id);
    if (response.status == 200) {
        const noteObj = await response.json();
        return noteObj;
    }
}