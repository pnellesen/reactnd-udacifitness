import React, { Component } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Foundation } from '@expo/vector-icons'
import { purple, white } from '../utils/colors'
import { Location, Permissions } from 'expo'
import { calculateDirection } from '../utils/helpers'


class Live extends Component {
    state = {
        coords: null,
        status: 'granted',
        direction: '',
        bounceValue: new Animated.Value(1)
    }
    componentDidMount() {
        Permissions.getAsync(Permissions.LOCATION)
            .then(({ status }) => {
                if (status === 'granted') {
                    return this.setLocation()
                } else {
                    this.setState({status: status})
                }

            })
            .catch((error) => {
                console.warn('Error getting location Permission: ', error)
                this.setState({status: 'undetermined'})
            })
    }

    askPermission = () => {
        Permissions.askAsync(Permissions.LOCATION)
            .then(({status}) => {
                if (status === 'granted') {
                    return this.setLocation()
                } else {
                    this.setState({status: status})
                }
            })
            .catch((error) => {
                console.warn('Error asking user for location Permission: ', error)
                this.setState({status: 'undetermined'})
            })
    }

    setLocation = () => {
        Location.watchPositionAsync({
            enableHighAccuracy: true,
            timeInterval: 1,
            distanceInterval: 1
        }, ({ coords }) => {
            const newDirection = calculateDirection(coords.heading)
            const { direction, bounceValue } = this.state

            if (newDirection !== direction) {
                Animated.sequence([
                    Animated.timing(bounceValue, { duration: 200, toValue: 1.04}),
                    Animated.spring(bounceValue, { toValue: 1, friction: 4})
                ]).start()
            }

           this.setState({
               coords,
               status: 'granted',
               direction: newDirection
           })
        })
    }

    render() {
        const { status, coords, direction, bounceValue } = this.state

        if (status === null) return <ActivityIndicator style={{marginTop: 30}}/>

        if (status === 'denied') {// permission to access apis was not given by device user
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50}/>
                    <Text>Location services for this app have been denied. You can change this by enabling them in your device settings</Text>
                    <TouchableOpacity onPress={this.askPermission}  style={styles.button}>
                        <Text style={styles.buttonText}>Settings</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        if (status === 'undetermined') {// tried to get permission but no response/weird response/something not expected
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50}/>
                    <Text>You need to enable location services to use the Live features of this app</Text>
                    <TouchableOpacity onPress={this.askPermission}  style={styles.button}>
                        <Text style={styles.buttonText}>Enable</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return (// Access has been granted
            <View style={styles.container}>
                <View style={styles.directionContainer}>
                    <Text style={styles.header}>You're heading</Text>
                    <Animated.Text style={[styles.direction, {transform: [{scale: bounceValue}]}]}>
                        {direction}
                    </Animated.Text>
                </View>
                <View style={styles.metricContainer}>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color: white}]}>
                            Altitude:
                        </Text>
                        <Text style={[styles.subHeader, {color: white}]}>
                            {coords && Math.round(coords.altitude)} Meters
                        </Text>
                    </View>

                    <View style={styles.metric}>
                        <Text style={[styles.header, {color: white}]}>
                            Speed:
                        </Text>
                        <Text style={[styles.subHeader, {color: white}]}>
                            {coords && coords.speed.toFixed(1)} M/S
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between'
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 30,
      marginRight: 30,
    },
    button: {
      padding: 10,
      backgroundColor: purple,
      alignSelf: 'center',
      borderRadius: 5,
      margin: 20,
    },
    buttonText :{
      color: white,
      fontSize: 20,
    },
    directionContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      header: {
        fontSize: 35,
        textAlign: 'center',
      },
      direction: {
        color: purple,
        fontSize: 120,
        textAlign: 'center',
      },
      metricContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: purple,
      },
      metric: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
      },
      subHeader: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 5,
      },
  })

export default Live