import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {SERVERIP, SERVERPORT} from "../../config";

let onUnauthorized = null;

export function setOnUnauthorizedHandler(handler) {
    onUnauthorized = handler;
}

const api = axios.create({
    baseURL: `http://${SERVERIP}:${SERVERPORT}/api`,
});

api.interceptors.request.use(
    async(config) => {

    if (config.url === '/auth/login' || config.url === '/auth/register') {
        return config;
    }

    const token = await SecureStore.getItemAsync('userToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => {
        return Promise.reject(error)
    }
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const reqURL = error.config.url || '';

        if (error.response?.status === 401 && !reqURL.includes('/auth/login')) {

            // Clear auth data and redirect to login
            await SecureStore.deleteItemAsync('userToken');
            if (onUnauthorized) {
                onUnauthorized();
            }

            return Promise.reject(new Error('Session expired'));
        }

        return Promise.reject(error);
    }
);


export default api;
