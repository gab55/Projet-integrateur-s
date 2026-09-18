import React from 'react';
import {globalStyles} from "../styles";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {AlarmStack} from "./AlarmStackNavigator";
import {SensorStack} from "./SensorStackNavigator";
import Lucide from "@react-native-vector-icons/lucide";
import {AlertProvider} from "../context/AlertContext";
import {SensorProvider} from "../context/SensorContext";
import {DashStack} from "./DashStack";

export const DashTab = createBottomTabNavigator({
    defaultScreenOptions: {
        showVerticalScrollIndicator: false,
        showHeader: false,
    },
    screens: {
        DashBoard: {
            screen: DashStack,
            options: {
                tabBarIcon: () => { return(<Lucide name="home" color={globalStyles.primaryColor} size={24} />)},
                headerShown: false,
            },

        },
        Sensors: {
            screen: SensorStack,
            options: {
                tabBarIcon: () => { return(<Lucide name="microchip" color={globalStyles.primaryColor} size={24} />)},
                headerShown: false
            }

        },
        Alarm: {
            screen: AlarmStack,
            options: {
                tabBarIcon: () => { return(<Lucide name="shield-alert" color={globalStyles.primaryColor} size={24} />)},
                headerShown: false,
            }
        },
    },
}).with(({ Navigator }) => (
    <AlertProvider>
        <SensorProvider>
        <Navigator />
        </SensorProvider>
    </AlertProvider>
));
