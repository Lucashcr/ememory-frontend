import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  months: string[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, months }) => (
  <View style={styles.header}>
    <Pressable onPress={onPrevMonth} style={styles.monthButton}>
      <ChevronLeft size={24} color="#64748b" />
    </Pressable>
    <Text style={styles.monthYear}>
      {months[currentDate.getMonth()]} {currentDate.getFullYear()}
    </Text>
    <Pressable onPress={onNextMonth} style={styles.monthButton}>
      <ChevronRight size={24} color="#64748b" />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

export default CalendarHeader;
