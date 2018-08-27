import React from 'react'
import { Text, View, Slider, Platform, StyleSheet } from 'react-native';
import { white, purple, gray } from '../utils/colors'

export default function UdaciSlider(props) {
      return (
        <View style={[styles.row, { justifyContent: 'space-between'}]}>
          <Slider
          style={{flex: 1}}
          minimumValue={0}
          maximumValue={props.max ? props.max : 10}
          step={props.step ? props.step : 1}
          value={props.value}
          onValueChange={props.onChange}/>
          <View style={styles.metricCounter}>
            <Text style={{fontSize: 24, textAlign:'center'}}>{props.value}</Text>
            <Text style={{fontSize: 18, color: gray}}>{props.unit}</Text>
          </View>
        </View>

      );
 }

 const styles = StyleSheet.create({

  row: {
    flex: 1,
    flexDirection:'row',
    alignItems:'center'
  },
  metricCounter: {
    width: 85,
    alignItems: 'center',
    justifyContent: 'center'
  }

 })