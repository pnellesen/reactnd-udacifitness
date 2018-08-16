import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import UdaciSlider  from './UdaciSlider'
import UdaciSteppers  from './UdaciSteppers'
import DateHeader from './DateHeader'
import Ionicons from '@expo/vector-icons/Ionicons';
import TextButton from './TextButton'
function SubmitButton ({ onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}>
            <Text>Submit</Text>
        </TouchableOpacity>

    )
}


export default class AddEntry extends Component {
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

        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            eat: 0,
            sleep: 0
        }))
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
    }

    render() {
        const metaInfo = getMetricMetaInfo();

        //Check to see if they've already entered information for today
        if (this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons
                        name="ios-happy-outline"
                        size={75}/>
                    <Text>You've already entered your information for today</Text>
                    <TextButton onPress={ ()=>this.reset() } children={'Reset'}/>
                </View>
            )
        }

        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {
                    Object.keys(metaInfo).map((key) => {
                        const {getIcon, type, ...rest} = metaInfo[key]
                        const value = this.state[key]
                        return (
                            <View key={key}>
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