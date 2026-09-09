import React from 'react';

export const AuthContext = React.createContext(null);
export const SignInContext = React.createContext(false);



export function useAuth() {
    return React.useContext(AuthContext);
}

export function useIsSignedIn() {
    return React.useContext(SignInContext);
}

export function useIsSignedOut() {
    return !useIsSignedIn();
}

export const initialAuthState = {
    isLoading: true,
    isSignedIn: false,
    userToken: null,
    user: null,
};

export function authReducer (prevState, action) {
    /**
     * @param {Object} prevState
     * @param {Object} action
     * @param {string} action.type
     * @param {string|null} [action.token]
     */

        switch (action.type) {
            case 'RESTORE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false
                }
            case 'SIGN_IN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false
                }
            case 'SIGN_OUT':
                return {
                    ...prevState,
                    userToken: null,
                    isLoading: false
                }
            case 'SET_USER':
                return {
                    ...prevState,
                    user: action.user,
                }
            default:
                return prevState;

            }
        }