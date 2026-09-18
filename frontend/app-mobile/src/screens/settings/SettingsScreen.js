import React from 'react';
import { View, Text } from 'react-native';
import {globalStyles} from "../../styles";

export default function SettingsScreen(){
    return(
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Settings</Text>
        </View>
    );
}