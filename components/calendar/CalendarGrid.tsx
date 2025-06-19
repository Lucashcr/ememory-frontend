import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface CalendarGridProps {
  days: (string | null)[];
  reviewsByDate: { [key: string]: any[] };
  onDayPress: (dateStr: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ days, reviewsByDate, onDayPress }) => (
  <View style={styles.calendar}>
    {days.map((dateStr, index) => (
      <Pressable
        key={index}
        style={styles.dayContainer}
        onPress={() => dateStr && onDayPress(dateStr)}
      >
        {dateStr && (
          <>
            <Text style={styles.dayNumber}>
              {new Date(dateStr + 'T00:00:00').getDate()}
            </Text>
            {reviewsByDate[dateStr] && (
              <View style={styles.reviewIndicators}>
                {reviewsByDate[dateStr].map((review, reviewIndex) => (
                  <View
                    key={reviewIndex}
                    style={[
                      styles.reviewDot,
                      { backgroundColor: review.subject.color },
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dayContainer: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    minHeight: 50,
    padding: 4,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  dayNumber: {
    fontSize: 14,
    color: '#1e293b',
  },
  reviewIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  reviewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 1,
  },
});

export default CalendarGrid;
