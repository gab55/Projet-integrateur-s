import {AppState, FlatList, Text, View} from 'react-native';
import {globalStyles} from "../../styles";
import React, {useEffect, useState} from 'react';
import {settings} from "../../../config";
import {Card} from "../../components/Card";
import {useSensor, useSensorActions} from "../../context/SensorContext";
import {useAlert, useAlertActions} from "../../context/AlertContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {TouchableSensorList} from "../../components/List";
import {useNavigation} from "@react-navigation/native";
import {TextButton} from "../../components/AppButton";
import {formatToTime} from "../../components/utils";
import {AlertHistoryGraph} from "../../components/Graph";

export default function DashScreen(){
    const [Data, setData] = useState({ Sensor: [], Alarm: [] });

    const { sensors, isLoading } = useSensor() || { sensors: [], isLoading: true };
    const { alarms } = useAlert() || { alerts: [] };
    const SensorActions = useSensorActions();
    const AlertActions = useAlertActions();
    const navigation = useNavigation();
    const [daysBack, setDaysBack] = useState(14);

    useEffect(() => {
        SensorActions.sensorList();
        AlertActions.alertList();
        AlertActions.alertMetrics(daysBack);

    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = {}


                const rawSensors = await SensorActions.sensorList();
                data.Sensor = (rawSensors || []).filter(sensor => sensor.armed === true).slice(0,3);
                const rawAlerts = await AlertActions.alertList  ();
                data.Alerts = (rawAlerts || []).filter(alert => alert.alarmOn === true).slice(0,3);
                data.AlertMetrics = await AlertActions.alertMetrics();
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
        ? `${Data.Alerts.length} alarmes actif`
        : "aucune alarmes";

    const renderMainContent = () => {
        const metricsArray = Data.AlertMetrics?.data || [];
        let alertCount = 0;
        if (metricsArray) {
            for (const [key, value] of Object.entries(metricsArray)) {
                alertCount += value.count;
            }
        }
        return (
        <View style={[globalStyles.container, {paddingBottom: 20}]}>
            <View style={{ flexGrow: 0}}>
            <Text style={[globalStyles.title, {marginVertical: 10, marginLeft: 15}]}>{alertsTitle}</Text>
                <FlatList
                    data={Data.Alerts}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        <Card >

                            <Text style={globalStyles.body}>
                                ⚠️ {item.type} - {item.sensor.type} - {item.sensor.location.name} - {formatToTime(item.startedOn)}
                            </Text>

                        </Card>
                    )}
                    ItemSeparatorComponent={() => <View style={{ width: 0 }} />}
                    contentContainerStyle={globalStyles.horizontalScrollPadding}

                />
            {Data.Alerts.length > 0 ?
                <TextButton
                onPress={() => navigation.navigate('Alarm')}
                text="Plus de details"
            /> : null}
            </View>


            <View style={[globalStyles.contentContainer]}>
            <Text style={[globalStyles.title, {paddingHorizontal: 20}]}>Capteurs Actifs</Text>
                {Data.Sensor.length > 0
                    ? <TouchableSensorList data={Data.Sensor} screen="Sensor Detail"  />
                    : (<Text style={globalStyles.body}>Aucun capteurs</Text>)
                }
            </View>

            <View style={[globalStyles.cardContainer, {paddingHorizontal: 16}]}>
                <Text style={[globalStyles.title, {paddingVertical: 8}]}>{`Alert Trends`}</Text>
                <Text style={[globalStyles.body, {
                    paddingBottom: 12,
                    paddingHorizontal: 20
                }]}>
                    {`Il y a ${alertCount} alertes sur les ${daysBack} derniers jours`}
                </Text>

                <AlertHistoryGraph data={Data.AlertMetrics} />
                </View>
        </View>
        )
    }


    return(

    <FlatList
        data={['main_content']}
        keyExtractor={(item) => item}
        style={[globalStyles.container]}
        contentContainerStyle={globalStyles.scrollViewContent}
        renderItem={renderMainContent}
    />
    );
}

