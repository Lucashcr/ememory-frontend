import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import NewReviewModal from '@/components/modals/new-revision';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

type Review = { subject: string; topic: string; color: string };

const mockReviews: Record<string, Review[]> = {
  '2024-02-15': [
    { subject: 'Matemática', topic: 'Funções Quadráticas', color: '#ef4444' },
    { subject: 'Física', topic: 'Leis de Newton', color: '#3b82f6' },
  ],
  '2024-02-20': [
    { subject: 'Química', topic: 'Tabela Periódica', color: '#22c55e' },
  ],
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const firstDayOfWeek = firstDay.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    for (let i = lastDay.getDay() + 1; i < 7; i++) {
      days.push(null);
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => changeMonth(-1)} style={styles.monthButton}>
          <ChevronLeft size={24} color="#64748b" />
        </Pressable>
        <Text style={styles.monthYear}>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <Pressable onPress={() => changeMonth(1)} style={styles.monthButton}>
          <ChevronRight size={24} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.weekDays}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.calendar}>
        {days.map((date, index) => (
          <Pressable
            key={index}
            style={styles.dayContainer}
            onPress={() => date && handleDayPress(date)}
          >
            {date && (
              <>
                <Text style={styles.dayNumber}>{date.getDate()}</Text>
                {mockReviews[formatDate(date)] && (
                  <View style={styles.reviewIndicators}>
                    {mockReviews[formatDate(date)].map(
                      (review, reviewIndex) => (
                        <View
                          key={reviewIndex}
                          style={[
                            styles.reviewDot,
                            { backgroundColor: review.color },
                          ]}
                        />
                      )
                    )}
                  </View>
                )}
              </>
            )}
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.reviewList}>
        {Object.entries(mockReviews).map(([date, reviews]) => (
          <View key={date} style={styles.dateReviews}>
            <Text style={styles.dateText}>
              {new Date(date).toLocaleDateString('pt-BR')}
            </Text>
            {reviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <View
                  style={[
                    styles.reviewColor,
                    { backgroundColor: review.color },
                  ]}
                />
                <View>
                  <Text style={styles.reviewSubject}>{review.subject}</Text>
                  <Text style={styles.reviewTopic}>{review.topic}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => {
          setSelectedDate(new Date());
          setModalVisible(true);
        }}
      >
        <Plus size={24} color="#fff" />
      </Pressable>

      <NewReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedDate={selectedDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
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
  reviewList: {
    marginTop: 16,
  },
  dateReviews: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  reviewSubject: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  reviewTopic: {
    fontSize: 12,
    color: '#64748b',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
