import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useEffect} from 'react';
import {globalStyles} from "./styles";
import {Navigation} from "./navigators/RootNavigator"
import { AuthContext, SignInContext, authReducer, initialAuthState } from './context/AuthContext';
import SplashScreen from "./screens/transitions/SplashScreen";
import { createAuthActions } from "./services/authActions";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";
import { setOnUnauthorizedHandler } from "./api/apiClient";
import * as Notifications from 'expo-notifications';
import { createNavigationContainerRef} from "@react-navigation/native";

export const globalNavigationRef = createNavigationContainerRef();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App(factory, deps) {
    // Reducer
    const [state, dispatch] = React.useReducer(authReducer, initialAuthState);

    // Notifications
    useEffect(() => {
        const subscriptionResponse = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;

            if (data && data.id) {
                console.log('Push notification clicked. Navigating to ID:', data.id);

                if (globalNavigationRef.isReady()) {

                    globalNavigationRef.navigate('AlertDetailScreen', { id: data.id });
                } else {
                    setTimeout(() => {
                        if (globalNavigationRef.isReady()) {
                            globalNavigationRef.navigate('AlertDetailScreen', { id: data.id });
                        }
                    }, 500);
                }
            }
        });

        return () => subscriptionResponse.remove();
    }, []);


    useEffect(() => {
        setOnUnauthorizedHandler(() => {
            dispatch({type: 'SIGN_OUT'});
        });
        return () => {
            setOnUnauthorizedHandler(null);
        }
    }, [dispatch]);


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
                <Navigation ref={globalNavigationRef}/>
        </SignInContext.Provider>
    </AuthContext.Provider>
    );
}

