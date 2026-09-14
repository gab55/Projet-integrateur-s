import {globalStyles} from "../styles";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SensorDetailScreen from "../screens/sensor/SensorDetailScreen";
import DashScreen from "../screens/dashboard/DashScreen";
import AlertDetailScreen from "../screens/alert/AlertDetailScreen";

export const DashStack = createNativeStackNavigator({
    defaultScreenOptions: {
        screen: DashScreen,
        showVerticalScrollIndicator: false,
        headerShown: false,
    },
    screens: {
        Dashboard: {
            screen: DashScreen,
            options: { headerShown: false }
        },
        "Alarm Detail": {
            screen: AlertDetailScreen,
            options: { headerShown: false }
        },
        "Sensor Detail": {
            screen: SensorDetailScreen,
            options: { headerShown: false }
        },
    },
})