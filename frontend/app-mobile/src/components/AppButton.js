import React from "react";
import {View, TouchableOpacity, Text} from "react-native";
import {globalStyles, COLORS} from "../styles";

export function AppButton({text, onPress, color}) {

    return (
        <TouchableOpacity onPress={onPress}
                          style={[
                              globalStyles.button,
                              color && {backgroundColor: color}]}>
            <Text style={globalStyles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}

export function TextButton({text, onPress}) {

    return (
        <TouchableOpacity onPress={onPress}
                          style={globalStyles.textbutton}>
            <Text style={[globalStyles.buttonText, {color: COLORS.blueContrast}]}>{text}</Text>
        </TouchableOpacity>
    )
}