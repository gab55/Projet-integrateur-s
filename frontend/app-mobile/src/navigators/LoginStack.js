import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {globalStyles} from "../styles";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "../screens/auth/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

export const LoginStack = createNativeStackNavigator({

    initialRouteName: 'Login',
    screenOptions: {
        headerShown: false,
    },
    screens: {
        Login: {
            screen: LoginScreen,
        },
        Register: {
            screen: RegisterScreen,
        },
        ForgotPassword: {
            screen: ForgotPasswordScreen,
        },
    },
});
