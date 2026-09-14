import React from 'react';
import {TextInput} from 'react-native';
import {globalStyles} from "../styles";


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

export function InputText({placeholder, onChangeText, value, height}) {
    return (
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            autoCapitalize={"sentences"}
            autoCorrect={true}
            keyboardType={'default'}
            style={[globalStyles.textInput, {height: height}]}
        />
    )
}

// export function TimePicker() {
//     return (
//         <TextInput
//         placeholder={'Heure'}
//         style={globalStyles.textInput}
//         >
//     )
// }

export  function WeekPicker() {}
