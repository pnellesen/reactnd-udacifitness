import React, { Component } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { getMetricMetaInfo, timeToString,  getDailyReminderValue } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'
import UdaciFitnessCalendar from 'udacifitness-calendar'
import { white } from '../utils/colors'
import DateHeader from './DateHeader'
import MetricCard from './MetricCard'
import { AppLoading } from 'expo'

class History extends Component {
    state = {
        ready: false
    }
    componentDidMount() {
        fetchCalendarResults()
        .then((entries) => this.props.dispatch(receiveEntries(entries)))
        .then(({ entries }) => {
            if (!entries[timeToString()]) {
                this.props.dispatch(addEntry({
                    [timeToString()]: getDailyReminderValue()// if today's entry isn't there, remind the user to enter it.
                }))
            }
        }).then(() => this.setState(() => (
            {ready: true}
        )))

    }
    renderItem = ({today, ...metrics}, formattedDate, key) => (
        <View style={styles.item}>
            {today
            ? <View>
                <DateHeader date={formattedDate}/>
                <Text style={styles.noDataText}>{today}</Text>
              </View>
            : <TouchableOpacity onPress={() => this.props.navigation.navigate(
                'EntryDetail',
                { entryId: key}
                )}>
                <MetricCard date={formattedDate} metrics={metrics}/>
              </TouchableOpacity>
            }

        </View>
    )

    renderEmptyDate(formattedDate) {
        return (
            <View style={styles.item}>
                <DateHeader date={formattedDate}/>
                <Text style={styles.noDataText}>No entry found</Text>
            </View>
        )
    }

    render() {
        const { entries } = this.props
        const { ready } = this.state
        if (ready === false) {
            return <AppLoading/>
        }
        return (
            <UdaciFitnessCalendar
                items={entries}
                renderItem={this.renderItem}
                renderEmptyDate={this.renderEmptyDate}/>

        );
    }
 }

 const styles= StyleSheet.create({
     item: {
      backgroundColor: white,
      borderRadius: Platform.OS === 'ios' ? 16 : 2,
      padding: 20,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 17,
      justifyContent: 'center',
      shadowRadius: 3,
      shadowOpacity: 0.8,
      shadowColor: 'rgba(0,0,0,0.24)',
      shadowOffset: {
          width: 0,
          height: 3
      }
     },
     noDataText: {
         fontSize: 16,
         paddingTop: 16,
         paddingBottom: 16
     }
 })

 function mapStateToProps(entries) {
     return {entries}
 }
 export default connect(mapStateToProps)(History)