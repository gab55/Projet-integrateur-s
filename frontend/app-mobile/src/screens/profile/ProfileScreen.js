
import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../../context/AuthContext';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Button, ActivityIndicator} from 'react-native';
import {globalStyles} from "../../styles";
import { useAuth } from '../../context/AuthContext';
import {Card} from "../../components/Card";
import {AppButton, TextButton } from "../../components/AppButton";
import {SafeAreaView} from "react-native-safe-area-context";



export default function ProfileScreen(){
    const { signOut, me } = useAuth();
    const { userToken, user } = useContext(AuthContext);

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await me(userToken);
                setProfileData(data);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };

            if (userToken) {
                fetchProfile();
            }
        }, [userToken]);


    if (loading) {
        return <View><ActivityIndicator size="large"></ActivityIndicator></View>;
    }

    const updatedDate = profileData?.user?.updatedAt ? new Date(profileData?.user?.updatedAt) : null;
    const actif = ((new Date() - updatedDate) <  (24 * 60 * 60 * 1000)) ? "Actif" : "Inactif";
    return(
        <View style={globalStyles.Container}>
            <Card title="Profil">

                <View style={globalStyles.inlineContainer}>
                    <Text style={globalStyles.Header3}>Nom: </Text>
                    <Text style={globalStyles.Header3}>{profileData?.user.firstName} {profileData?.user.name}</Text>
                </View>
                <View style={globalStyles.inlineContainer}>
                    <Text style={globalStyles.Header3}>Courriel: </Text>
                    <Text style={globalStyles.Header3}>{profileData?.user.email}</Text>
                </View>
            <View style={globalStyles.inlineContainer}>
                <Text style={globalStyles.Header3}>Role: </Text>
                <Text style={globalStyles.Header3}>{profileData?.user.role}</Text>
            </View>
                <View style={globalStyles.inlineContainer}>
                    <Text style={globalStyles.Header3}>Depuis: </Text>
                    <Text style={globalStyles.Header3}>{profileData?.user.createdAt.toString().slice(0, 10)}</Text>
                </View>
                <View style={globalStyles.inlineContainer}>
                    <Text style={globalStyles.Header3}>Actif: </Text>
                    <Text style={globalStyles.Header3}>{actif}</Text>
                </View>
                



            </Card>
            <TextButton
                text={'Déconnexion'}
                onPress={() => signOut()}
            />
        </View>

    );
}

const styles = StyleSheet.create({});