import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react-native';
import NewReviewModal from '@/components/modals/new-revision';
import ReviewDetails from '@/components/modals/review-details';
import { useReviews, Review } from '@/contexts/ReviewsContext';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function Calendar() {
  const { reviews, isReviewCompleted, toggleReview, formatDate } = useReviews();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviewDetailsVisible, setReviewDetailsVisible] = useState(false);

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

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const getReviewStatus = (review: Review, date: string) => {
    if (date === review.initialDate) {
      return 'Inicial';
    }
    const reviewIndex = review.reviewDates.indexOf(date);
    switch (reviewIndex) {
      case 0:
        return '1 dia';
      case 1:
        return '7 dias';
      case 2:
        return '15 dias';
      case 3:
        return '30 dias';
      case 4:
        return '60 dias';
      default:
        return '';
    }
  };

  const days = getDaysInMonth(currentDate);
  const reviewsByDate = reviews.reduce((acc: { [key: string]: Review[] }, review) => {
    const dates = [review.initialDate, ...review.reviewDates];
    dates.forEach(date => {
      acc[date] = [...(acc[date] || []), review];
    });
    return acc;
  }, {});

  const sortedReviewDates = Object.entries(reviewsByDate)
    .filter(([date]) => {
      const reviewDate = new Date(date);
      return reviewDate.getUTCMonth() === currentDate.getUTCMonth() && 
             reviewDate.getUTCFullYear() === currentDate.getUTCFullYear();
    })
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());

  return (
    <View style={styles.container}>
      <ScrollView style={styles.reviewList}>
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
                  {reviewsByDate[formatDate(date)] && (
                    <View style={styles.reviewIndicators}>
                      {reviewsByDate[formatDate(date)].map(
                        (review, reviewIndex) => (
                          <View
                            key={reviewIndex}
                            style={[
                              styles.reviewDot,
                              { backgroundColor: review.subject.color },
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

        <View style={{padding: 4, marginTop: 16}}>
          {sortedReviewDates.map(([date, dateReviews]) => (
            <View key={date} style={styles.dateReviews}>
              <Text style={styles.dateText}>
                {new Date(date).toLocaleDateString('pt-BR')}
              </Text>
              {dateReviews.map((review, index) => (
                <Pressable
                  key={`${review.id}-${index}`}
                  style={[
                    styles.reviewItem,
                    isReviewCompleted(review) && styles.reviewItemCompleted
                  ]}
                  onPress={() => {
                    setSelectedReview(review);
                    setReviewDetailsVisible(true);
                  }}
                >
                  <View
                    style={[
                      styles.reviewColor,
                      { backgroundColor: review.subject.color },
                    ]}
                  />
                  <View style={styles.reviewContent}>
                    <Text style={[
                      styles.reviewTopic,
                      isReviewCompleted(review) && styles.reviewTextCompleted
                    ]}>
                      {review.topic}
                    </Text>
                    <Text style={[
                      styles.reviewSubject,
                      isReviewCompleted(review) && styles.reviewTextCompleted
                    ]}>
                      {review.subject.name}
                    </Text>
                    <Text style={[
                      styles.reviewDate,
                      isReviewCompleted(review) && styles.reviewTextCompleted
                    ]}>
                      {date === review.initialDate ? 'Data inicial' : `Data de revisão (${getReviewStatus(review, date)})`}
                    </Text>
                  </View>
                  {isReviewCompleted(review) && (
                    <View style={styles.completedCheckmark}>
                      <Check size={16} color="#22c55e" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          ))}
        </View>
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

      <ReviewDetails
        review={selectedReview}
        visible={reviewDetailsVisible}
        onClose={() => setReviewDetailsVisible(false)}
        isCompleted={!!selectedReview && isReviewCompleted(selectedReview)}
        onToggleComplete={(id: string) => {
          const review = reviews.find((r) => r.id === id);
          if (review) {
            toggleReview(review);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    gap: 8,
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
  reviewTopic: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  reviewSubject : {
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
  reviewItemCompleted: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reviewTextCompleted: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  reviewContent: {
    flex: 1,
  },
  completedCheckmark: {
    marginLeft: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
});
