import {globalStyles} from "../styles";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {SensorListScreen as AlertListScreen} from "../screens/alert/AlertListScreen";
import AlertDetailScreen from "../screens/alert/AlertDetailScreen";
import ValidationScreen from "../screens/alert/ValidationScreen";

export const AlarmStack = createNativeStackNavigator({
    defaultScreenOptions: {
        screen: AlertListScreen,
    },
    screens: {
        List: {
            screen: AlertListScreen,
            options: {
            headerShown: false,
            }
        },
        Detail: {
            screen: AlertDetailScreen,
            options: {
                headerShown: false,
            }
        },
        Resolve: {
            screen: ValidationScreen,
            options: {
                headerShown: false,
            }
        },
    },
})