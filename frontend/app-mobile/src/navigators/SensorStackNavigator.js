import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SensorListScreen from "../screens/sensor/SensorListScreen";
import SensorDetailScreen from "../screens/sensor/SensorDetailScreen";

export const SensorStack = createNativeStackNavigator({
    defaultScreenOptions: {
        screen: SensorListScreen,
    },

    screens: {
        List: {
            screen: SensorListScreen,
            options: {
                headerShown: false,
            }
        },
        Detail: {
            screen: SensorDetailScreen,
            options: {
                headerShown: false,
            }
        },
    },
})