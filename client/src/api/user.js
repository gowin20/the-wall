import {SERVER_DOMAIN} from '../config.ts';
export const getUserById = async (id) => {
    const response = await fetch(SERVER_DOMAIN+'/users/id/'+id);
    if (response.status == 200) {
        const user = await response.json();
        return user;
    }
}

export const getAllUsers = async () => {
    const response = await fetch(SERVER_DOMAIN+'/users/');
    if (response.status == 200) {
        const allUsers = await response.json();
        return allUsers;
    }
}