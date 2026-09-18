import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import {COLORS, globalStyles} from '../styles';

function processData({data, sensors=[]}) {
    const pad = (num) => String(num).padStart(2, '0');
    const hourlySummary = {};
    const totalDays = data.range.days;

    for (let h = 0; h < 24; h++) {
        let padH = pad(h);
        hourlySummary[padH] = {
            label: `${padH}h`,
            count: 0
        };
    }

    data.data.forEach(item => {
        const isSensorIncluded = sensors.length === 0 || sensors.includes(item.sensorId);
        if (!isSensorIncluded) return;

        const hourKey = item.hourLabel
        if (!hourKey) return;

        if (hourlySummary[hourKey]) {
            hourlySummary[hourKey].count += item.count;
        } else {
            hourlySummary[hourKey] = {
                count: item.count/totalDays
            };
        }
    });

    return Object.keys(hourlySummary)
        .sort()
        .map(key => {
            const item = hourlySummary[key];
            return {
                label: item.label,
                count: Number((item.count / totalDays).toFixed(1))
            };
        });
    }

export function AlertHistoryGraph({data, sensors}) {
    if (!data || !data.data || data.data.length === 0)
        return (<Text style={globalStyles.body}>No data</Text>)

    const combinedData = processData({data, sensors});

    const labels = combinedData.map((item, index) =>
        index % 3 === 0 ? item.label : ''
    );

    const dataPoints = combinedData.map(item => item.count);

    const cardPadding = globalStyles.Chart.paddingHorizontal * 2;
    const width = Dimensions.get('window').width - cardPadding - 18;
    const height = 220;

    return (
        <View style={[globalStyles.card, localStyle.cardWrapperFix]}>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [{data: dataPoints}]
                }}
                width={width}
                height={height}
                yAxisSuffix="x"
                chartConfig={{
                    backgroundColor: COLORS.white,
                    backgroundGradientFrom: COLORS.white,
                    backgroundGradientTo: COLORS.white,
                    decimalPlaces: 1,
                    color: (opacity = 1) => COLORS.secondary,
                    labelColor: (opacity = 1) => COLORS.darktext,
                    style: {borderRadius: 12},
                    propsForDots: {
                        r: '4',
                        strokeWidth: '2',
                        stroke: COLORS.blueContrast
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: '',
                    }
                }}
                bezier
                style={globalStyles.Chart}
            />
        </View>
    );
}

const localStyle = StyleSheet.create({
    cardWrapperFix: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

});