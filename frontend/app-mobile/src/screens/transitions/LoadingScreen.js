import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {globalStyles} from "../../styles";

export default function LoadingScreen(){

    return(
        <View style={globalStyles.container}>

            <Text style={globalStyles.title}>... Loading ...</Text>

        </View>

    );
}

const styles = StyleSheet.create({});