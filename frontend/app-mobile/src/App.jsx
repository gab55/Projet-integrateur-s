import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, {createContext, useState, useContext, useMemo} from 'react';
import {globalStyles} from "./styles";
import {Navigation} from "./navigators/RootNavigator"
import { AuthContext, SignInContext, authReducer, initialAuthState } from './context/AuthContext';
import SplashScreen from "./screens/transitions/SplashScreen";
import { createAuthActions } from "./services/authActions";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";

export default function App(factory, deps) {
    // Reducer
    const [state, dispatch] = React.useReducer(authReducer, initialAuthState);

    // bootstrap ou restore token
    useAuthBootstrap(dispatch)

    // Memoization du authContext
    const authContext = useMemo(
        () => ({
            ...createAuthActions(dispatch),
            userToken: state.userToken,
            user: state.user,
        }),
        [dispatch, state.userToken, state.user]
    );


    if (state.isLoading) {
        return <SplashScreen />
    }

    const isSignedIn = state.userToken !== null;


    return (
    <AuthContext.Provider value={authContext}>
        <SignInContext.Provider value={isSignedIn}>
                <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent"/>
                <Navigation />
        </SignInContext.Provider>
    </AuthContext.Provider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
