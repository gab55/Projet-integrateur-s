import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, } from 'react-native';
import {
    createDrawerNavigator,
    createDrawerScreen,
} from '@react-navigation/drawer';
import HistoryScreen from "../screens/history/HistoryScreen";
import StatScreen from "../screens/statistics/StatScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingScreen from "../screens/settings/SettingScreen";
import ContactScreen from "../screens/various/ContactScreen";
import {DashTab} from "./DashTabNavigator";
import { globalStyles, COLORS } from "../styles";
import { useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Lucide from "@react-native-vector-icons/lucide";
import Octicons from '@react-native-vector-icons/octicons';
import {useNavigation} from "@react-navigation/native";



export const DrawerNavigator = createDrawerNavigator({
    screenOptions: {
        drawerActiveTintColor: COLORS.primary,
        drawerActiveBackgroundColor: COLORS.secondary,
        drawerInactiveTintColor: COLORS.darktext,
        drawerItemStyle: {
        },
        drawerLabelStyle: {
            fontSize: globalStyles.Header3.fontSize,
            fontFamily: globalStyles.Header3.fontFamily,

        },
        defaultScreen: 'DashBoard',
        drawerType: 'slide',
        drawerStyle: {
            backgroundColor: COLORS.white,
        }
    },
    screens: {
        DashBoard: {
            screen: DashTab,
            options: {
                drawerIcon: () => { return(<Lucide name="layout-dashboard" color="#000" size={24} />)},}
        },

        Historique: {
            screen: HistoryScreen,
            options: {
                drawerIcon: () => { return(<Lucide name="history" color="#000" size={24} />)},}
        },
        Statistiques: {
            screen: StatScreen,
            options: {
                drawerIcon: () => { return(<Octicons name="graph" color="#000" size={24} />)},}
        },

        Profile: {
            screen: ProfileScreen,
            options: {
                drawerIcon: () => { return(<Lucide name="file-user" color="#000" size={24} />)},}
        },

        Parametres: {
            screen: SettingScreen,
            options: {
                drawerIcon: () => { return(<Lucide name="settings" color="#000" size={24} />)},}
        },

        Contactes: {
            screen: ContactScreen,
            options: {
                drawerIcon: () => { return(<Lucide name="contact-round" color="#000" size={24} />)},}
        }
    },
}).with(({ Navigator }) => {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [isExpanded, setIsExpanded] = useState(false);



    return (
        <Navigator
            screenOptions={{
                drawerType: isLargeScreen ? 'permanent' : 'slide',
                drawerStyle: {
                    width: isLargeScreen ? (isExpanded ? 240 : 80) : 240,
                    backgroundColor: COLORS.white,
                },
                drawerLabel: (isLargeScreen && !isExpanded) ? () => null : undefined,
                drawerItemStyle: isLargeScreen ? {
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                } : {},

            }}
        />
    );
});



