import React, { useState, useEffect } from 'react';
import { Text, RefreshControl, View } from 'react-native';
import {globalStyles} from "../../styles";
import { TouchableSensorList } from "../../components/List";
import {SafeAreaView} from "react-native-safe-area-context";
import {useSensor, useSensorActions} from "../../context/SensorContext";
import { useNavigation } from '@react-navigation/native';


export default function SensorListScreen(){
    const { sensors, isLoading } = useSensor();
    const actions = useSensorActions();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        actions.sensorList();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await actions.sensorList();
        setRefreshing(false);
    };
    if (isLoading && sensors.length === 0) {
        return (
            <SafeAreaView style={globalStyles.center}>
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    const RenderHeader = () => {
        return (
            <View style={{paddingTop: 10}}>
            <Text style={[globalStyles.title, {paddingHorizontal: 15}]}>Liste Capteurs</Text>

            </View>
        );
    };
    return(
        <SafeAreaView style={globalStyles.container}>

            <TouchableSensorList
                data={sensors}
                RenderHeader={RenderHeader}
                screen="Detail"
                refreshing={refreshing}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }/>
        </SafeAreaView>
    );
}