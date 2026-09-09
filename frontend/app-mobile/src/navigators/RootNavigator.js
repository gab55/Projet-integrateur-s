import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createStaticNavigation} from "@react-navigation/native";
import { useIsSignedIn, useIsSignedOut } from '../context/AuthContext';
import {DrawerNavigator} from './DrawerNavigator';
import {LoginStack} from "./LoginStack";
import {globalStyles} from "../styles";
import ProfileScreen from "../screens/profile/ProfileScreen";

export const RootNavigator = createNativeStackNavigator({
    groups: {
        LoggedIn: {
            if: useIsSignedIn,
            initialRouteName: 'Home',
            screens: {
                Home: {
                    screen: DrawerNavigator,
                    options: { headerShown: false },
                },
                Profile: {
                    screen: ProfileScreen,
                    options: { headerShown: false },
                }
            }
        },
        LoggedOut: {
            if: useIsSignedOut,
            initialRouteName: 'LoginFlow',
            screens: {
                // Home: ExDrawerScreen,
                LoginFlow: {
                screen: LoginStack,
                options: {headerShown: false },
                }
            }
        }
    }
});

export const Navigation = createStaticNavigation(RootNavigator);