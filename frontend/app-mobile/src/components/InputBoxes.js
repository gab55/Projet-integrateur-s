import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput} from 'react-native';
import {globalStyles} from "../styles";
import DatePicker from 'react-datepicker';
import { startOfWeek, endOfWeek, isSameDay, eachDayOfInterval } from 'date-fns';


export function InputEmail({placeholder, onChangeText, value}) {
    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            textContentType={'emailAddress'}
            keyboardType={'email-address'}
            style={globalStyles.textInput}
            autoCapitalize={'none'}
        />
)
}

export function InputPassword({placeholder, onChangeText, value}) {
    return (
        <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        textContentType={'password'}
        secureTextEntry={true}
        style={globalStyles.textInput}
        />
    )
}

export function InputNip({placeholder, onChangeText, value}) {
    return (
        <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        keyboardType={'numeric'}
        secureTextEntry={true}
        style={globalStyles.textInput}
        maxLength={6}
        />
    )
}

export function InputName({placeholder, onChangeText, value}) {
    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            textContentType={'name'}
            autoCapitalize={'words'}
            autoCorrect={false}
            keyboardType={'default'}
            style={globalStyles.textInput}
        />
    )
}

export function InputNumber({placeholder, onChangeText, value}) {
    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            keyboardType={'numeric'}
            style={globalStyles.textInput}
        />)}

// export function TimePicker() {
//     return (
//         <TextInput
//         placeholder={'Heure'}
//         style={globalStyles.textInput}
//         >
//     )
// }

export  function WeekPicker() {}
