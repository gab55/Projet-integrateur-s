import {View, Text, FlatList} from 'react-native';
import {COLORS, globalStyles} from "../../styles";
import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import {settings} from "../../../config";
import {Card} from "../../components/Card";
import {useSensor, useSensorActions} from "../../context/SensorContext";
import {useAlert, useAlertActions} from "../../context/AlertContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {TouchableSensorList} from "../../components/List";
import {useNavigation} from "@react-navigation/native";
import {TextButton} from "../../components/AppButton";
import { formatToTime } from "../../components/utils";



export default function DashScreen(){
    const [Data, setData] = useState({ Sensor: [], Alarm: [] });

    const { sensors, isLoading } = useSensor() || { sensors: [], isLoading: true };
    const { alarms } = useAlert() || { alerts: [] };
    const SensorActions = useSensorActions();
    const AlarmActions = useAlertActions();
    const navigation = useNavigation();

    useEffect(() => {
        SensorActions.sensorList();
        AlarmActions.alertList();

    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = {}


                const rawSensors = await SensorActions.sensorList();
                data.Sensor = (rawSensors || []).filter(sensor => sensor.armed === true).slice(0,3);
                const rawAlerts = await AlarmActions.alertList  ();
                data.Alerts = (rawAlerts || []).filter(alert => alert.alarmOn === true).slice(0,3);
                setData(data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setData({ Sensor: [], Alerts: [] });
            }
        };

        fetchData();
        let intervalId = setInterval(fetchData, settings.fetchInterval);

        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                fetchData();
                clearInterval(intervalId);
                intervalId = setInterval(fetchData, settings.fetchInterval);
            } else {
                clearInterval(intervalId);
            }
        });

        return () => {
            clearInterval(intervalId);
            subscription.remove();
        };

    }, [settings.fetchInterval]);


    if (isLoading && sensors.length === 0) {
        return (
            <SafeAreaView style={globalStyles.center}>
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    if (!Data || !Data.Alerts || !Data.Sensor) {
        return (
            <SafeAreaView style={globalStyles.center}>
                <Text>Attente des données...</Text>
            </SafeAreaView>
        );
    }

    const alertsTitle = Data.Alerts.length > 0
        ? `${Data.Alerts.length} alarmes actif: ${Data.Alerts.map(alert => alert.type).join(', ')}`
        : "aucune alarmes";

    return(
        <View style={globalStyles.container}>
            <Card title={alertsTitle}>
                <FlatList
                    data={Data.Alerts}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                    <View style={[
                        globalStyles.inlineContainer,
                        { borderColor: Data.Alerts.length > 0  ? '#FF3B30' : COLORS.secondary }
                    ]}>

                        <Text style={globalStyles.body}> ⚠️ {item.type} - {item.status} - {formatToTime(item.startedOn)} </Text>
                    </View>
                    )}
                    contentContainerStyle={globalStyles.horizontalScrollPadding}

                />
            </Card>
            {Data.Alerts.length > 0 ?
                <TextButton
                onPress={() => navigation.navigate('Alarm')}
                text="Plus de details"
            /> : null}




            <View style={globalStyles.contentContainer}>
            <Text style={[globalStyles.title, {paddingHorizontal: 20}]}>Capteurs Actifs</Text>
                {Data.Sensor.length > 0
                    ? <TouchableSensorList data={Data.Sensor} screen="Sensor Detail"  />
                    : (<Text style={globalStyles.body}>Aucun capteurs</Text>)
                }
            </View>

        </View>

    );
}

