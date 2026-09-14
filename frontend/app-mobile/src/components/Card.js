import React from "react";
import {View, TouchableOpacity, Text, ActivityIndicator} from "react-native";
import {globalStyles} from "../styles";
import {SafeAreaView} from "react-native-safe-area-context";
import {TextButton} from "./AppButton";

export function TouchableCard({title, children, onPress, color}) {
    /**
     * @param {string} title
     * @param {React.ReactNode} children
     * @param {() => void} onPress
     * @param {string} color (optional overrides default color)
     */
    return (
        <View style={globalStyles.cardContainer}>
            <TouchableOpacity onPress={onPress}
                              style={[
                                  globalStyles.card,
                                  color && {backgroundColor: color}]}>
                {title && <Text style={globalStyles.title}>{title}</Text>}

                {children}
            </TouchableOpacity>
        </View>
    )
}

export function Card({title, children}) {
    /**
     * @param {string} title
     * @param {React.ReactNode} children
     */
    return (
        <View style={globalStyles.cardContainer}>
            {title && <Text style={globalStyles.title}>{title}</Text>}
            <View style={globalStyles.card}>
                {children}
            </View>

        </View>
    )
}

export function LoadingCard({title, setLoading}) {
    return(
    <SafeAreaView style={globalStyles.container}>
        <Card title={title}>
            <Text style={[globalStyles.Header3, {alignSelf: 'center'}]}>Veuillez patienter...</Text>
            <ActivityIndicator size="large" style={{padding: 50}}></ActivityIndicator>
            <TextButton
                text={'Retourner'}
                onPress={() => setLoading(false)}
            />
        </Card>
    </SafeAreaView>
    )}