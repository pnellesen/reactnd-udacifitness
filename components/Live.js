import React, { Component } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

class Live extends Component {
    state = {
        coords: null,
        status: null,
        direction: ''
    }
    render() {
        const { status, coords, direction } = this.state

        if (status === null) return <ActivityIndicator style={{marginTop: 30}}/>

        if (status === 'denied') {// permission to access apis was not given by device user
            return (
                <View>
                    <Text>Permission Denied</Text>
                </View>
            )
        }

        if (status === 'undetermined') {// tried to get permission but no response/weird response/something not expected
            return (
                <View>
                    <Text>Permission Undetermined</Text>
                </View>
            )
        }

        return (// Access has been granted
            <View>
                <Text>Live </Text>
                <Text>{JSON.stringify(this.state)}</Text>
            </View>
        )
    }
}

export default Live