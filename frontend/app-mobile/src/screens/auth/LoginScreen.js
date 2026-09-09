import React from 'react';
import {View, StyleSheet, Button, Switch, Text, Platform, KeyboardAvoidingView} from 'react-native';
import {globalStyles} from "../../styles";
import {AuthContext, useAuth} from "../../context/AuthContext";
import {useNavigation} from "@react-navigation/native";
import { AppButton, TextButton } from '../../components/AppButton';
import { Card } from '../../components/Card';
import { InputEmail, InputPassword } from "../../components/InputBoxes";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from "react-native-safe-area-context";


export default function LoginScreen(){
    const { signIn } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });
    const [error, setError] = React.useState({});
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const validateLoginForm = () => {
        let activeErrors = {};
        if (!formData.email) activeErrors.email = "Le couriel est requis"
        if (!formData.email.match(/^\S+@\S+\.\S+$/))
            activeErrors.email = "Adresse e-mail invalide"
        if (!formData.password )
            activeErrors.password = "Le mot de passe est requis"
        setError(activeErrors);
        return Object.keys(activeErrors).length === 0;
    }


    const handleSubmit = async () => {
        if (validateLoginForm()) {
            try {
                await signIn(formData);
            } catch (error) {
                setErrorMessage(error.message);
            }
        }
    }

    return(
        <SafeAreaView style={globalStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={globalStyles.contentContainer}
            >
            <Card title={'Connexion'}>
                <Text style={globalStyles.caption}>Courriel</Text>
                <InputEmail value={formData.email}
                            onChangeText={value => handleInputChange('email', value)}
                            placeholder={'Courriel'} />
                { error.email && <Text style={globalStyles.error}>{error.email}</Text>}

                <Text style={globalStyles.caption}>Mot de Passe</Text>
                <InputPassword value={formData.password}
                               onChangeText={value => handleInputChange('password', value)}
                               placeholder={'Mot de Passe'} />
                { error.password && <Text style={globalStyles.error}>{error.password}</Text>}
                {errorMessage && <Text style={globalStyles.error}>{errorMessage}</Text>}
                <AppButton text={'Connexion'} onPress={() => handleSubmit()} />

                <TextButton text={'Mot de Passe Oublie'} onPress={() => navigation.navigate('ForgotPassword')}/>
                <TextButton text={'Register'} onPress={() => navigation.navigate('Register')}
                />
            </Card>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}




const styles = StyleSheet.create({});