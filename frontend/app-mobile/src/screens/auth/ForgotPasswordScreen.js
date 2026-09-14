import React from 'react';
import {Text, Platform, KeyboardAvoidingView} from 'react-native';
import {globalStyles} from "../../styles";
import {StackActions, useNavigation} from "@react-navigation/native";
import {AuthContext} from "../../context/AuthContext";
import {Card, LoadingCard} from "../../components/Card";
import { InputEmail } from "../../components/InputBoxes";
import {AppButton, TextButton} from "../../components/AppButton";
import {SafeAreaView} from "react-native-safe-area-context";


export default function ForgotPasswordScreen(){
    const { forgotPassword } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState({});
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [loading, setLoading] = React.useState(false);


    const validateForm = () => {
        let activeErrors = {};
        if (!email) activeErrors.email = "Le couriel est requis"
        else if (!email.match(/^\S+@\S+\.\S+$/)) {
            activeErrors.email = "Adresse e-mail invalide"
        }

        setError(activeErrors);
        return Object.keys(activeErrors).length === 0;
    }


    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                setLoading(true);
                await forgotPassword({email});
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        }
    }

    if (loading) {
        return  <LoadingCard title={'Mot de passe oublie'} setLoading={setLoading}/>
    }

    return(
        <SafeAreaView style={globalStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={globalStyles.contentContainer}
            >
            <Card title={'Recouvrez votre mot de passe'}>

                <Text style={globalStyles.caption}>Courriel</Text>
                <InputEmail
                    value={email}
                    onChangeText={setEmail}
                    placeholder={'Courriel'}
                />
                { error.email && <Text style={globalStyles.error}>{error.email}</Text>}
                {errorMessage && <Text style={globalStyles.error}>{errorMessage}</Text>}
                <AppButton text={'Enregistrer'} onPress={() => handleSubmit()} />
                <TextButton
                    text={'Retourner'}
                    onPress={() => navigation.dispatch(StackActions.popToTop())}
                />
            </Card>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}







