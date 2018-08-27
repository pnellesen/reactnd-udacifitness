import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { white, purple, gray } from '../utils/colors'
import { FontAwesome, Entypo } from '@expo/vector-icons'

export default function UdaciSteppers({max, unit, step, value, onIncrement, onDecrement}) {
      return (
        <View style={[styles.row, { justifyContent: 'space-between'}]}>
          {Platform.OS === 'ios'
            ?
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.iosBtn} onPress={onDecrement}>
                  <Entypo name='minus' size={30} color={purple}/>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iosBtn, {marginLeft:3}]} onPress={onIncrement}>
                <Entypo name='plus' size={30} color={purple}/>
              </TouchableOpacity>
            </View>
          :
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={styles.androidBtn} onPress={onDecrement}>
                  <FontAwesome name='minus' size={30} color={white}/>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.androidBtn, {marginLeft:3}]} onPress={onIncrement}>
                <FontAwesome name='plus' size={30} color={white}/>
              </TouchableOpacity>
            </View>
          }
            <View style={styles.metricCounter}>
              <Text style={{fontSize: 24, textAlign:'center'}}>{value}</Text>
              <Text style={{fontSize: 18, color: gray}}>{unit}</Text>
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
  iosBtn: {
    backgroundColor: white,
    borderColor: purple,
    borderWidth: 1,
    padding:5,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 3
  },

  androidBtn: {
    backgroundColor: purple,
    padding:10,
    borderRadius: 3
  },
  metricCounter: {
    width: 85,
    alignItems: 'center',
    justifyContent: 'center'
  }

 })