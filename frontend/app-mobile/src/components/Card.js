import React from "react";
import {View, TouchableOpacity, Text} from "react-native";
import {globalStyles} from "../styles";

export function TouchableCard({title, children, onPress, color}) {
    /**
     * @param {string} title
     * @param {React.ReactNode} children
     * @param {() => void} onPress
     * @param {string} color (optional overrides default color)
     */
    return (
        <View style={globalStyles.cardContainer}>
            <Text style={globalStyles.title}>
                {title}
            </Text>
            <TouchableOpacity onPress={onPress}
                              style={[
                                  globalStyles.card,
                                  color && {backgroundColor: color}]}>
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
            <Text style={globalStyles.title}>{title}</Text>
            <View style={globalStyles.card}>{children}</View>

        </View>
    )
}