import {SERVER_DOMAIN} from './api.js';
export const getUserById = async (id) => {
    const response = await fetch(SERVER_DOMAIN+'/users/id/'+id);
    if (response.status == 200) {
        const user = await response.json();
        return user;
    }
}