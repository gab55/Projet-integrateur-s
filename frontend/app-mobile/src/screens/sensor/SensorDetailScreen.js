import React, {useEffect, useState} from 'react';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import {Text, View, Alert, FlatList} from 'react-native';
import {useSensor, useSensorActions} from '../../context/SensorContext';
import {globalStyles} from '../../styles';
import {SafeAreaView} from "react-native-safe-area-context";
import {Card} from "../../components/Card";
import {AppButton, TextButton} from "../../components/AppButton";
import {InputNip} from "../../components/InputBoxes";
import {formatDateTime} from "../../components/utils";


export default function SensorDetailScreen() {
    const route = useRoute();
    const {id} = route.params;
    const {sensors} = useSensor();
    const navigation = useNavigation();
    const SensorActions = useSensorActions();

    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [sensorHistory, setSensorHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const sensor = sensors.find((s) => s?._id?.toString() === id?.toString());

    useEffect(() => {
        if (!sensor?._id || !sensor) return;

        const fetchHistory = async () => {
            try {
                setHistoryLoading(true);
                const historyData = await SensorActions.sensorHistory(sensor._id);
                setSensorHistory(historyData?.readings || historyData?.Readings || []);
            } catch (error) {
                console.error("Failed to load history metrics:", error);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
    }, [id]);


    if (!sensor) {
        return (
            <SafeAreaView style={globalStyles.container}>
                <Text>Capteur introuvable.</Text>
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
            if (sensor.armed) {
                await SensorActions.disarmSensor(sensor._id, pin);
                Alert.alert("Success", "Sensor disarmed successfully!");
            } else {
                await SensorActions.armSensor(sensor._id, pin);
                Alert.alert("Success", "Sensor armed successfully!");
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

    const renderHeader = () => (
        <View style={globalStyles.contentContainer}>
            {!confirmationVisible && (
                <Card title={`Capteur: ${sensor._id}`}>
                <View style={globalStyles.columnContainer}>
                    <Text style={[globalStyles.body, {color: !sensor.armed ? 'red' : 'green'}]}>
                        Status: {sensor.armed ? 'Active' : 'Inactive'} {loading && "(Mise à jour...)"}
                    </Text>
                    <Text style={globalStyles.body}>Type: {sensor.type}</Text>
                    <Text style={globalStyles.body}>Modele: {sensor.model}</Text>
                    <Text style={globalStyles.body}>Emplacement: {sensor.location}</Text>
                </View>
                <AppButton text={sensor.armed ? "Disarm System" : "Arm System"}
                           onPress={() => setConfirmationVisible(true)}/>
            </Card>
            )
        }
        {confirmationVisible && (
            <View style={globalStyles.contentContainer}>
                <Card title={`Confirmez ${sensor.armed ? "disarmer" : "armer"} capteur: ${sensor._id}`}>
                    <Text style={globalStyles.title}>Entrer votre Code</Text>
                    <InputNip value={pin} onChangeText={setPin}/>
                    <AppButton text="Confirm" onPress={handleConfirmation} loading={loading}/>
                    <AppButton text="Annuler" onPress={() => {
                        setConfirmationVisible(false);
                        setLoading(false)
                    }
                    } loading={loading}/>

                </Card>
            </View>
        )}
            <Text style={[globalStyles.title, {paddingHorizontal: 20, paddingTop: 20}]}>Historique</Text>
        </View>
    );

    const renderFooter = () => (
        <View style={globalStyles.contentContainer}>
            <TextButton
                text={'Retourner'}
                onPress={() => navigation.dispatch(StackActions.popToTop())}
            />
            </View>
    )


    return (
        <View style={globalStyles.container}>
            <FlatList
                data={sensorHistory}
                keyExtractor={(item) => item?._id?.toString() || Math.random().toString()}
                ListHeaderComponent={renderHeader()}
                ListFooterComponent={renderFooter()}

                renderItem={({ item }) => {
                    return (
                    <Card>
                        <Text style={globalStyles.Header3}>{formatDateTime(item.recordedAt)}</Text>
                        <Text style={globalStyles.body}>{`Capteur : ${sensor.type} - ${sensor.model}`}</Text>
                        <Text style={globalStyles.body}>{`Valeur : ${item.value}`}</Text>
                    </Card>
                    )
                }}
                contentContainerStyle={globalStyles.scrollContainer}
            />
        </View>
    );
}

