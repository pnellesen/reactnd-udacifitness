import React, { Component } from 'react'
import { View, Text } from 'react-native';
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { getMetricMetaInfo, timeToString,  getDailyReminderValue } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'
import UdaciFitnessCalendar from 'udacifitness-calendar'

class History extends Component {
    componentDidMount() {
        fetchCalendarResults()
        .then((entries) => this.props.dispatch(receiveEntries(entries)))
        .then(({ entries }) => {
            if (!entries[timeToString()]) {
                this.props.dispatch(addEntry({
                    [timeToString()]: getDailyReminderValue()// if today's entry isn't there, remind the user to enter it.
                }))
            }
        })
    }
    renderItem = ({today, ...metrics}, formattedDate, key) => (
        <View>
            {today
            ? <Text>{JSON.stringify(today)}</Text>
            : <Text>{JSON.stringify(metrics)}</Text>
            }
        </View>
    )

    renderEmptyDate(formattedDate) {
        return (
            <View>
                <Text>No data for this date</Text>
            </View>
        )
    }

    render() {
        const { entries } = this.props
        return (
            <UdaciFitnessCalendar
                items={entries}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}/>

        );
    }
 }

 function mapStateToProps(entries) {
     return {entries}
 }
 export default connect(mapStateToProps)(History)