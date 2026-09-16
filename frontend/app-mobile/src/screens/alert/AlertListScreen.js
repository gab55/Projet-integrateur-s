import React, { useState, useEffect } from 'react';
import { Text, RefreshControl, View } from 'react-native';
import {globalStyles} from "../../styles";
import { TouchableAlertList } from "../../components/List";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAlert, useAlertActions} from "../../context/AlertContext";
import { useNavigation } from '@react-navigation/native';


export function SensorListScreen() {
    const {alerts, isLoading} = useAlert();
    const navigation = useNavigation();
    const actions = useAlertActions();
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        actions.alertList();

    }, []);




    const onRefresh = async () => {
        setRefreshing(true);
        await actions.alertList();
        setRefreshing(false);
    };
    if (isLoading && alerts.length === 0) {
        return (
            <SafeAreaView style={globalStyles.center}>
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    const RenderHeader = () => {
        return (
        <View style={{paddingTop: 10}}>
            <Text style={[globalStyles.title, {paddingHorizontal: 15}]}>Liste Alertes</Text>

        </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <TouchableAlertList
                data={alerts}
                RenderHeader={RenderHeader}
                screen="Detail"
                refreshing={refreshing}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }/>
        </View>
    );
}