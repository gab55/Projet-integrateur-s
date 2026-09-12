
import React, { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export function useAuthBootstrap(dispatch) {
    useEffect(() => {
        const bootstrapAsync = async () => {
            let userToken = null;
            try {
                userToken = await SecureStore.getItemAsync('userToken')
            } catch (e) {
                console.error("Failed to restore token", e)
            }
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };

        bootstrapAsync();
    }, [dispatch]);    }

