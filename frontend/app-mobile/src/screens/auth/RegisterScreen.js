
import React from 'react';
import {View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from "../../styles";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../context/AuthContext";
import {Card} from "../../components/Card";
import {InputEmail, InputName, InputNip, InputNumber, InputPassword} from "../../components/InputBoxes";
import {AppButton, TextButton } from "../../components/AppButton";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default function RegisterScreen(){
    const { signUp } = useAuth();
    const navigation = useNavigation();

    const [formData, setFormData] = React.useState({
        firstName: '',
        name: '',
        nip: '',
        email: '',
        password: '',
    });
    const [error, setError] = React.useState('');

    const validateRegisterForm = () => {
        // Premier nom
        let activeErrors = {};
        if (!formData.firstName) {
            activeErrors.firstName = "Le surnom est requis"
        } else if (formData.firstName.length < 2) {
            activeErrors.firstName = "Le surnom doit contenir au moins 2 caractères"
        }
        // Dernier nom
        if (!formData.name) {
            activeErrors.name = "Le prénom est requis"
        } else if (formData.name.length < 2) {
            activeErrors.name = "Le prénom doit contenir au moins 2 caractères"
        }
        // Email
        if (!formData.email.match(/^\S+@\S+\.\S+$/))
            activeErrors.email = "Adresse e-mail invalide"
        // Mot de passe
        if (formData.password.length < 6 )
            activeErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
        // Nip
        if (!formData.nip ) {
            activeErrors.nip = "Le Nip doit exister"
        } else if (formData.nip.length < 4) {
            activeErrors.nip = "Le Nip doit contenir au moins 4 chiffres"
        }

        setError(activeErrors);
        return Object.keys(activeErrors).length === 0;
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const handleSubmit = async () => {

        if (validateRegisterForm()) {
            try {
                await signUp(formData);
            } catch (serverError) {
                console.error('Error during registration:', serverError);
                setError({ server: `${serverError.message}` });
            }
        }
    }

    return(
        <SafeAreaView style={globalStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={globalStyles.contentContainer}
            >

            <Card title={'Register'}>
                <Text style={globalStyles.Header1}>Bienvenue a AppSecure</Text>
                <Text style={[globalStyles.Header1, {marginBottom: 5 }]}>Inscrivez vous pour commencer</Text>
                <Text style={[globalStyles.body, {marginBottom: 20 }]}>Seulement un peu d'informations pour s'inscrire</Text>

                <Text style={globalStyles.caption}>Surnom</Text>
                <InputName
                    value={formData.firstName}
                    onChangeText={(text) => handleInputChange('firstName', text)}
                    placeholder={'Surnom'}
                />
                {error.firstName && <Text style={globalStyles.error}>{error.firstName}</Text>}

                <Text style={globalStyles.caption}>Nom</Text>
                <InputName
                    value={formData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    placeholder={'Surnom'}
                />
                {error.name && <Text style={globalStyles.error}>{error.name}</Text>}

                <Text style={globalStyles.caption}>Courriel</Text>
                <InputEmail
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder={'Courriel'}
                />
                {error.email && <Text style={globalStyles.error}>{error.email}</Text>}

                <Text style={globalStyles.caption}>Mot de Passe</Text>
                <InputPassword
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    placeholder={'Mot de Passe'}
                />
                {error.password && <Text style={globalStyles.error}>{error.password}</Text>}

                <Text style={globalStyles.caption}>Nip</Text>
                <InputNip
                    value={formData.nip}
                    onChangeText={(text) => handleInputChange('nip', text)}
                    placeholder={'Nip'}
                />
                {error.nip && <Text style={globalStyles.error}>{error.nip}</Text>}

                <AppButton text={'Enregistrer'} onPress={handleSubmit} />
                <TextButton
                    text={'Retourner'}
                    onPress={() => navigation.goBack()}
                />
            </Card>

            </KeyboardAvoidingView>
        </SafeAreaView>

    )
}