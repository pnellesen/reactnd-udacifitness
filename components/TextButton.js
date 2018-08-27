import React from 'react'
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { white, purple, gray } from '../utils/colors'

export default function TextButton({children, onPress, style={} }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={[styles.reset, style]}>{children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    reset: {
        textAlign: 'center',
        color: purple
    },
    iosBtn: {
      backgroundColor: white,
      borderColor: purple,
      borderWidth: 1,
      padding:5,
      paddingLeft: 25,
      paddingRight: 25,
      borderRadius: 3,
    },

    androidBtn: {
      backgroundColor: purple,
      padding:10,
      borderRadius: 3
    }

   })