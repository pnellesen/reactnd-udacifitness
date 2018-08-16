import React from 'react'
import { Text, View, Slider } from 'react-native';

export default function UdaciSlider(props) {
      return (
        <View>
          <Slider
          minimumValue={0}
          maximumValue={props.max ? props.max : 10}
          step={props.step ? props.step : 1}
          value={props.value}
          onValueChange={props.onChange}/>
          <View>
          <Text>{props.value}</Text>
          <Text>{props.unit}</Text>
          </View>
        </View>

      );
 }