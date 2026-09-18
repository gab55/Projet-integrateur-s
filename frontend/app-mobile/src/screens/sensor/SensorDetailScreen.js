import React, {useCallback, useEffect, useState} from 'react';
import {StackActions, useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {Text, View, Alert, FlatList} from 'react-native';
import {useSensor, useSensorActions} from '../../context/SensorContext';
import {globalStyles} from '../../styles';
import {SafeAreaView} from "react-native-safe-area-context";
import {Card} from "../../components/Card";
import {AppButton, TextButton} from "../../components/AppButton";
import {InputNip} from "../../components/InputBoxes";
import {formatDateTime} from "../../components/utils";
import {AlertHistoryGraph} from "../../components/Graph";
import {useAlertActions} from "../../context/AlertContext";

export default function SensorDetailScreen() {
    const route = useRoute();
    const {id} = route.params;
    const {sensors} = useSensor();
    const navigation = useNavigation();
    const SensorActions = useSensorActions();
    const AlertActions = useAlertActions();

    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [sensorHistory, setSensorHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const [graphData, setGraphData] = useState(null);
    const [daysBack, setDaysBack] = useState(7);

    const sensor = sensors.find((s) => s?._id?.toString() === id?.toString());

    useEffect(() => {
        if (!sensor?._id || !sensor) return;

        const fetchHistory = async () => {
            try {
                setHistoryLoading(true);
                const historyData = await SensorActions.sensorHistory(sensor._id);
                const graphData = await AlertActions.alertMetrics(daysBack);
                setSensorHistory(historyData?.readings || historyData?.Readings || []);
                setGraphData(graphData);
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
            console.error(error.message);
            Alert.alert("Failed", "Verify your security code.");
        } finally {
            setLoading(false);
        }
    };

    // Reset on blur
    useFocusEffect(
        useCallback(() => {

            return () => {
                setConfirmationVisible(false);
                setPin('');
            };
        }, [setConfirmationVisible, setPin])
    );

    const renderHeader = () => (
        <View style={globalStyles.contentContainer}>
            {!confirmationVisible && (
                <Card title={`Capteur: ${sensor._id}`}>

                    <Text style={[globalStyles.body, {color: !sensor.armed ? 'red' : 'green'}]}>
                        Status: {sensor.armed ? 'Active' : 'Inactive'} {loading && "(Mise à jour...)"}
                    </Text>
                    <Text style={globalStyles.body}>Type: {sensor.type}</Text>
                    <Text style={globalStyles.body}>Modele: {sensor.model}</Text>
                    <Text style={globalStyles.body}>Emplacement: {sensor.location?.name}</Text>

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
                        setPin('');
                        setLoading(false)
                    }
                    } loading={loading}/>

                </Card>
            </View>
        )}
        </View>
    );


    const renderMiddle = () => {
        const metricsArray = graphData?.data || [];
        let alertCount = 0;
        if (graphData) {
            for (const [key, value] of Object.entries(metricsArray)) {
                if (value.sensorId.toString() === sensor?._id.toString()) {
                    alertCount += value.count;
                }
            }
        }

        // Sensor Detail Screen
        return (
        <View style={globalStyles.contentContainer}>

            <View style={[globalStyles.cardContainer, {paddingHorizontal: 16}]}>
                <Text style={[globalStyles.title, {paddingTop: 8}]}>{`Historique Alertes de ce capteur`}</Text>
                <Text style={[globalStyles.body, {
                    paddingBottom: 12,
                    paddingHorizontal: 20
                }]}>
                    {`Il y a ${alertCount} alertes sur les ${daysBack} derniers jours`}
                </Text>

                <AlertHistoryGraph data={graphData} sensors={[sensor._id]}/>
            </View>

            <TextButton
                text={'Retourner'}
                onPress={() => navigation.dispatch(StackActions.popToTop())}
            />
        </View>
        )
    }

    return (
        <View style={globalStyles.container}>
            <FlatList
                data={sensorHistory}
                keyExtractor={(item) => item?._id?.toString() || Math.random().toString()}
                ListHeaderComponent={
                    <>
                        {renderHeader()}
                        {renderMiddle()}
                        {<Text style={[globalStyles.title, {paddingHorizontal: 20, paddingTop: 20}]}>Historique</Text>}
                    </>
                }
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
