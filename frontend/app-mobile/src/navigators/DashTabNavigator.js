import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {globalStyles} from "../styles";
import {
    createBottomTabNavigator,
    createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import DashScreen from "../screens/dashboard/DashScreen";
import {AlarmStack} from "./AlarmStack";
import {SensorStack} from "./SensorStackNavigator";


export const DashTab = createBottomTabNavigator({
    screens: {
        Dash: createBottomTabScreen({
            screen: DashScreen,
        }),
        Sensors: createBottomTabScreen({
            screen: SensorStack,
        }),
        Alarm: createBottomTabScreen({
            screen: AlarmStack,
        }),
    },
});