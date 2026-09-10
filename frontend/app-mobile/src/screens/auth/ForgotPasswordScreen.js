import React from 'react';
import {Text, Platform, KeyboardAvoidingView} from 'react-native';
import {globalStyles} from "../../styles";
import {useNavigation} from "@react-navigation/native";
import {AuthContext} from "../../context/AuthContext";
import {Card} from "../../components/Card";
import { InputEmail } from "../../components/InputBoxes";
import { AppButton } from "../../components/AppButton";
import {SafeAreaView} from "react-native-safe-area-context";


export default function ForgotPasswordScreen(){
    const { forgotPassword } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState({});
    const [errorMessage, setErrorMessage] = React.useState(null);


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
                await forgotPassword({email});
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
                <AppButton
                    title={'Retourner'}
                    onPress={() => navigation.goBack()}
                />
            </Card>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}







