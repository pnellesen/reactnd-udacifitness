import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString,  getDailyReminderValue } from '../utils/helpers'
import { submitEntry, removeEntry } from '../utils/api'
import { white, purple, blue, red } from '../utils/colors'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import UdaciSlider  from './UdaciSlider'
import UdaciSteppers  from './UdaciSteppers'
import DateHeader from './DateHeader'
import Ionicons from '@expo/vector-icons/Ionicons';
import TextButton from './TextButton'
import { NavigationActions } from 'react-navigation'


function SubmitButton ({ onPress }) {
    return (
        <TouchableOpacity
            style= {Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={onPress}>
            <Text style={styles.submitBtnTxt}>Submit</Text>
        </TouchableOpacity>

    )
}


class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        eat: 0,
        sleep: 0
    }

    increment = (metric) => {
        const {max, step} = getMetricMetaInfo(metric)
        this.setState((state) => {
            const count = state[metric] + step
            return {
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }

    decrement = (metric) => {
        const { step } = getMetricMetaInfo(metric)
        this.setState((state) => {
            const count = state[metric] - step
            return {
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value
        }))
    }

    submit = () => {
        const key = timeToString()
        const entry = this.state;
        // Will update other things here as we progress

        this.props.dispatch(addEntry({
            [key]: entry
        }))
        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            eat: 0,
            sleep: 0
        }))

        this.toHome()

        submitEntry({key, entry});
    }

    reset = () => {
        const key = timeToString()
        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            eat: 0,
            sleep: 0
        }))
        // Update Redux, Route to Home, Update the device DB/storage
        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))

        this.toHome()

        removeEntry(key)

    }

    toHome = () => {
        this.props.navigation.dispatch(NavigationActions.back({
            key: 'AddEntry'
        }))
    }

    render() {
        const metaInfo = getMetricMetaInfo();

        //Check to see if they've already entered information for today
        if (this.props.alreadyLogged) {

            return (
                <View style={styles.center}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? "ios-happy-outline" : "md-happy"}
                        size={75}/>
                    <Text>You've already entered your information for today</Text>
                    <TextButton style={{padding: 20}} onPress={ ()=>this.reset() } children={'Reset'}/>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {
                    Object.keys(metaInfo).map((key) => {
                        const {getIcon, type, ...rest} = metaInfo[key]
                        const value = this.state[key]
                        return (
                            <View key={key} style={styles.row}>
                                {getIcon()}
                                {type === 'slider'
                                    ? <UdaciSlider
                                        value={value}
                                        onChange = {(value) => this.slide(key, value)}
                                        {...rest}/>
                                    : <UdaciSteppers
                                        value={value}
                                        onIncrement={() => this.increment(key)}
                                        onDecrement={() => this.decrement(key)}
                                        {...rest}/>
                                }
                            </View>
                        )
                    })
                }
                <SubmitButton onPress={this.submit}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:20,
        backgroundColor: white
    },
    row: {
        flex: 1,
        flexDirection:'row',
        alignItems:'center'
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding:10,
        borderRadius: 7,
        height:45,
        marginLeft: 40,
        marginRight: 40
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        padding:10,
        borderRadius: 2,
        height:45,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitBtnTxt: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
 })

function mapStateToProps(state) {
    const key=timeToString()
    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)