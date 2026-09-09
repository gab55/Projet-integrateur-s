import * as SecureStore from 'expo-secure-store';
import {SERVERIP, SERVERPORT} from '../../config';
import api from '../api/apiClient';
import {createContext} from 'react';

const AuthContext = createContext();

export const createAuthActions= (dispatch) => {
    const actions = {
        me: async (token) => {
            /**
             * Fetch user data
             * @param {string} token - The authentication token.
             **/
            try {
                const response = await api.get('/auth/me', {
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        },
        signIn: async (data) => {
            /**
             * Sign in user
             * @param {Object} data - The user data for signing in.
             * @param {string} data.email - The user's email.
             * @param {string} data.password - The user's password.
             **/
            try {
                const response = await api.post(`/auth/login`, {
                        email: data.email,
                        password: data.password
                });

                const json = response.data;
                await SecureStore.setItemAsync('userToken', json.token);


                dispatch({ type: 'SIGN_IN', token: json.token})
            }
            catch (error) {
                const errorMessage = error.response?.data?.message || "Identifiant ou mot de passe incorrect";
                console.error('Erreur de connexion:', errorMessage);

                throw new Error(errorMessage);

            }
        },

        signOut: async () => {
            /**
             * Sign-out user
             *
             **/
            try {
                await SecureStore.deleteItemAsync('userToken');
                dispatch({type: 'SIGN_OUT'});
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error.message);
                throw error;
            }
        },
        signUp: async (data) => {
            /**
             * Sign up user
             *
             * @param {Object} data - The user data for signing up.
             * @param {string} data.firstName - The user's first name.
             * @param {string} data.name - The user's last name.
             * @param {string} data.nip - The user's NIP.
             * @param {string} data.email - The user's email.
             * @param {string} data.password - The user's password.
             **/
            try {
                const response = await api.post(`http://${SERVERIP}:${SERVERPORT}/api/auth/register`, {
                    firstName: data.firstName,
                    name: data.name,
                    nip: data.nip,
                    email: data.email,
                    password: data.password,
                });
                const json = response.data;
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