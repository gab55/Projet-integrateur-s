import {useAlert, useAlertActions} from '../../context/AlertContext';
import {globalStyles} from '../../styles';
import {SafeAreaView} from "react-native-safe-area-context";
import {Card} from "../../components/Card";
import {AppButton, TextButton} from "../../components/AppButton";
import React, { useState } from 'react';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import { Text, View, Alert } from 'react-native';
import {InputNip} from "../../components/InputBoxes";
import {formatDateTime} from "../../components/utils";


export default function AlertDetailScreen(){
    const route = useRoute();
    const { id } = route.params;
    const { alerts } = useAlert();
    const navigation = useNavigation();
    const AlertActions = useAlertActions();

    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);

    const alert = alerts.find((s) => s?._id?.toString() === id?.toString());


    if (!alert) {
        return (
            <SafeAreaView style={globalStyles.container}>
                <Text>Alerte introuvable.</Text>
            </SafeAreaView>
        );
    }

    const handleConfirmation = async () => {
        if (!pin || pin.length < 4) {
            Alert.alert("Error", "Please enter a valid security code.");
            return;
        }
        setLoading(true);
        try {
            if (alert.alarmOn || alert.status !== "RESOLVED") {
                await AlertActions.resolveAlert(alert._id, pin);
                Alert.alert("Success", "Alert resolved successfully!");
            } else {
                Alert.alert("This is awkward", "Alert already exists!");
            }
            setConfirmationVisible(false);
            setPin('');
        } catch (error) {
            console.error(error);
            Alert.alert("Failed", "Verify your security code.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={globalStyles.container}>
            {!confirmationVisible && (
                <View style={globalStyles.contentContainer}>

                    <Card title={`Alerte: ${alert._id}`}>

                            <Text style={[globalStyles.body, {color: alert.alarmOn ? 'red' : 'green'}]}>
                                Status: {alert.status} {loading && "(Mise à jour...)"}
                            </Text>
                            <Text style={globalStyles.body}>Type: {alert.type}</Text>
                            <Text style={globalStyles.body}>Debut le {formatDateTime(alert.startedOn)}</Text>
                            <Text style={globalStyles.body}>Message: {alert.message}</Text>
                            { alert.alarmOn && (
                                <AppButton
                                    text={"Résoudre l'alerte"}
                                    onPress={() => setConfirmationVisible(true)}
                                />
                            )}
                    </Card>

                    {!alert.alarmOn && (
                        <Card title={"Alerte résolue"}>
                            <Text style={globalStyles.body}>
                                {`Date: ${formatDateTime(alert.resolvedAt)}`}
                            </Text>
                            <Text style={globalStyles.body}>
                                {`Responsable: ${alert.resolvedBy?.firstName} ${alert.resolvedBy?.name}`}
                            </Text>
                        </Card>
                    )}

                </View>
                )}

                {confirmationVisible && (
                    <View style={globalStyles.contentContainer}>
                        <Card title={`Confirmez pour résoudre l'alarme: ${alert._id}`}>
                            <Text style={globalStyles.title}>Entrer votre Code</Text>
                            <InputNip
                                value={pin}
                                onChangeText={setPin}
                            />
                            <AppButton
                                text="Confirm"
                                onPress={handleConfirmation}
                                loading={loading}/>
                            <AppButton
                                text="Annuler"
                                onPress={() => {
                                    setConfirmationVisible(false);
                                    setLoading(false)
                                }}
                                loading={loading}
                            />
                        </Card>
                    </View>
                )}

            <View style={globalStyles.contentContainer}>
                <TextButton
                    text={'Retourner'}
                    onPress={() => navigation.dispatch(StackActions.popToTop())}
                />
            </View>

        </View>
    );
}