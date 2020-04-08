import React from 'react'
import { Text, View, Dimensions, TouchableOpacity } from 'react-native'
import {
    BarChart,
  } from "react-native-chart-kit";
 
export const ChartList = (props) => {
    return (
        <View>
            <Text style={{
            color: '#58647a',
            fontSize: 16,
            fontWeight: 'bold',
            }}>{props.title}</Text>
            <BarChart  
            data={props.data} width={ Dimensions.get("window").width / 1.1} height={220}
            chartConfig={chartConfig} verticalLabelRotation={0} />
        </View>
    )
}

const chartConfig = {
    backgroundColor: '#58647a',
    backgroundGradientFrom: "#263654",
    backgroundGradientTo: "#8f8e8d",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
        borderRadius: 36
    },
    //strokeWidth: 2, // optional, default 3
    //barPercentage: 0.5
};