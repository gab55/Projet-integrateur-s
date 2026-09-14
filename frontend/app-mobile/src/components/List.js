import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {globalStyles} from "../styles";
import {Card, TouchableCard} from "./Card";
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSensor} from "../context/SensorContext";
import {formatDateTime} from "./utils";




export function TouchableSensorList({ data, screen, RenderHeader=null }) {
    const navigation = useNavigation();
    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item._id.toString()}
            ListHeaderComponent={RenderHeader}

            renderItem={({ item }) => (
                <TouchableCard title={item.title} onPress={() => {
                    navigation.navigate(screen, {id: item._id})
                }}>
                    <View style={globalStyles.rowContainer}>
                        <View style={globalStyles.statusColumn}>
                        <View style={[globalStyles.circle , {backgroundColor: !item.armed ?  'red' : 'green'}]}/>
                            <Text style={globalStyles.Header3}>{`${item.armed ? 'actif' : 'inactif'}`}</Text>
                        </View>
                        <View style={globalStyles.infoColumn}>
                            <Text style={globalStyles.Header3}>{`Capteur: ${item.type} - Modèle: ${item.model}`}</Text>
                            <Text style={globalStyles.body}>{`Emplacement: ${item.location}`}</Text>
                        </View>
                    </View>
                </TouchableCard>
            )}
        />
    );
}

export function TouchableAlertList({ data, screen, RenderHeader=null }) {
    const navigation = useNavigation();
    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item._id.toString()}
            ListHeaderComponent={RenderHeader}
            renderItem={({ item }) => {
                return (
                <TouchableCard title={item.title} onPress={() => {
                    navigation.navigate(screen, {id: item._id})
                }}>
                    <View style={globalStyles.rowContainer}>
                        <View style={globalStyles.statusColumn}>
                            {item.alarmOn ? <Text style={globalStyles.Header1}>⚠️</Text> : <Text style={globalStyles.Header1}> </Text>}
                            {/*<View style={[globalStyles.circle , {backgroundColor: item.alarmOn ?  'red' : 'transparent'}]}/>*/}
                        </View>
                        <View style={globalStyles.infoColumn}>
                            <Text style={globalStyles.Header3}>{`Alarme: ${item.type} - ${item.alarmOn ? 'actif' : 'inactif'}`}</Text>
                            <Text style={globalStyles.body}>{`Commencé: ${formatDateTime(item.startedOn)}`}</Text>
                            <Text style={globalStyles.body}>{`Message: ${item.message}`}</Text>


                        </View>
                    </View>
                </TouchableCard>
            )
            }}
        />
    );
}

export function List({ data }) {
    const route = useRoute();
    const {id} = route.params;
    const {sensors} = useSensor();

    const sensor = sensors.find((s) => s?._id?.toString() === id?.toString());

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item?._id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
                <Card>
                    <Text style={globalStyles.Header3}>{item.sensor}</Text>
                    <Text>{item.recordedAt}</Text>
                    <Text>{item.value}</Text>
                </Card>
            )}
        />
    );
}









