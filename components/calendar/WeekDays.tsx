import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WeekDaysProps {
  days: string[];
}

const WeekDays: React.FC<WeekDaysProps> = ({ days }) => (
  <View style={styles.weekDays}>
    {days.map((day) => (
      <Text key={day} style={styles.weekDay}>
        {day}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: '#64748b',
    fontWeight: '500',
  },
});

export default WeekDays;
