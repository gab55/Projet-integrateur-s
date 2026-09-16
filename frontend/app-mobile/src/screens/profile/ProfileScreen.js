
import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {globalStyles} from "../../styles";
import { useAuth } from '../../context/AuthContext';
import {Card} from "../../components/Card";
import { TextButton } from "../../components/AppButton";

export default function ProfileScreen(){
    const { signOut, me } = useAuth();

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await me();
                setProfileData(data);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };

        if (me) {
            fetchProfile();
        }
        }, [me]);


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

