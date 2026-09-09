import * as SecureStore from 'expo-secure-store';
import { SERVERIP, SERVERPORT } from '../../config';


export const createAuthActions= (dispatch) => {
    const actions = {
        me: async (token) => {
            try {
                const response = await fetch(`http://${SERVERIP}:${SERVERPORT}/api/auth/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const json = await response.json();
                if (!response.ok) {
                    throw new Error(json.message || "Failed to fetch user data");}
                return json;
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        },
        signIn: async (data) => {

            try {
                const response = await fetch(`http://${SERVERIP}:${SERVERPORT}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password }),
                });

                const json = await response.json();
                if (!response.ok) {
                    throw new Error(json.message || "identifiant ou mot de passe incorrect");}

                await SecureStore.setItemAsync('userToken', json.token)
                dispatch({ type: 'SIGN_IN', token: json.token})
            }
            catch (error) {
                console.error('Erreur de connexion:', error.message);
                throw error;
            }
        },

        signOut: async () => {
            try {
                await SecureStore.deleteItemAsync('userToken');
                dispatch({type: 'SIGN_OUT'});
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error.message);
                throw error;
            }
        },
        signUp: async (data) => {
            try {
                const response = await fetch(`http://${SERVERIP}:${SERVERPORT}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: data.firstName,
                        name: data.name,
                        nip: data.nip,
                        email: data.email,
                        password: data.password,
                    }),
                });
                const json = await response.json();
                if (!response.ok) {
                    throw new Error(json.message || "échec de l'inscription");}
                console.log('Inscription Reussi ! Connexion automatique dans un moment');
                await actions.signIn({
                    email: data.email,
                    password: data.password,
                });
            } catch (error) {
                console.error('Erreur lors de l\'inscription:', error.message);
                throw error;
            }
        },
}
    return actions;
}