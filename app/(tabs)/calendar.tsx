import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Plus, Check, Ban } from 'lucide-react-native';
import NewReviewModal from '@/components/modals/new-revision';
import ReviewDetails from '@/components/modals/review-details';
import { useReviews, Review } from '@/contexts/ReviewsContext';
import { formatDateString, formatDateToLocalString } from '@/services/dateUtils';
import CustomRefreshControl from '@/components/layout/refresh-control';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function Calendar() {
  const { reviews, toggleReview, deleteReview } = useReviews();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDateString(new Date()));
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
      const currentDay = new Date(year, month, i);
      days.push(formatDateString(currentDay));
    }

    const lastDayOfWeek = lastDay.getDay();
    for (let i = lastDayOfWeek + 1; i < 7; i++) {
      days.push(null);
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleDayPress = (dateStr: string) => {
    setSelectedDate(dateStr);
    setModalVisible(true);
  };

  const getReviewStatus = (review: Review, date: string) => {
    const reviewIndex = review.review_dates.findIndex(
      (rd) => rd.scheduled_for === date
    );
    switch (reviewIndex) {
      case 0:
        return 'Inicial';
      case 1:
        return '1 dia';
      case 2:
        return '7 dias';
      case 3:
        return '14 dias';
      case 4:
        return '28 dias';
      case 5:
        return '56 dias';
      default:
        return '';
    }
  };

  const isReviewCompleted = (review: Review, date: string) => {
    const reviewDate = review.review_dates.find(
      (rd) => rd.scheduled_for === date
    );
    return reviewDate?.status === 'completed';
  };

  const days = getDaysInMonth(currentDate);
  const reviewsByDate = reviews.reduce((acc: { [key: string]: Review[] }, review) => {
    review.review_dates.forEach(rd => {
      const reviewDate = new Date(rd.scheduled_for + 'T00:00:00');
      if (reviewDate.getMonth() === currentDate.getMonth() &&
          reviewDate.getFullYear() === currentDate.getFullYear()) {
        acc[rd.scheduled_for] = [...(acc[rd.scheduled_for] || []), review];
      }
    });
    return acc;
  }, {});

  const sortedReviewDates = Object.entries(reviewsByDate)
    .filter(([date]) => {
      const reviewDate = new Date(date + 'T00:00:00');
      return reviewDate.getMonth() === currentDate.getMonth() && 
             reviewDate.getFullYear() === currentDate.getFullYear();
    })
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.reviewList} showsVerticalScrollIndicator={false} refreshControl={CustomRefreshControl()}>
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
          {days.map((dateStr, index) => (
            <Pressable
              key={index}
              style={styles.dayContainer}
              onPress={() => dateStr && handleDayPress(dateStr)}
            >
              {dateStr && (
                <>
                  <Text style={styles.dayNumber}>
                    {new Date(dateStr + 'T00:00:00').getDate()}
                  </Text>
                  {reviewsByDate[dateStr] && (
                    <View style={styles.reviewIndicators}>
                      {reviewsByDate[dateStr].map(
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

        <View style={{ padding: 4, marginTop: 16 }}>
          {sortedReviewDates.map(([date, dateReviews]) => (
            <View key={date} style={styles.dateReviews}>
              <Text style={styles.dateText}>
                {formatDateToLocalString(date)}
              </Text>
              {dateReviews.map((review, index) => {
                const isCompleted = isReviewCompleted(review, date);
                const isSkipped = review.review_dates.find(
                  rd => rd.scheduled_for === date
                )?.status === 'skipped';

                return (
                  <Pressable
                    key={`${review.id}-${index}`}
                    style={[
                      styles.reviewItem,
                      isCompleted && styles.reviewItemCompleted,
                      isSkipped && styles.reviewItemSkipped,
                    ]}
                    onPress={() => {
                      setSelectedReview(review);
                      setSelectedDate(date);
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
                      <Text
                        style={[
                          styles.reviewTopic,
                          isCompleted && styles.reviewTextCompleted,
                          isSkipped && styles.reviewTextSkipped,
                        ]}
                      >
                        {review.topic}
                      </Text>
                      <Text
                        style={[
                          styles.reviewSubject,
                          isCompleted && styles.reviewTextCompleted,
                          isSkipped && styles.reviewTextSkipped,
                        ]}
                      >
                        {review.subject.name}
                      </Text>
                      <Text
                        style={[
                          styles.reviewDate,
                          isCompleted && styles.reviewTextCompleted,
                          isSkipped && styles.reviewTextSkipped,
                        ]}
                      >
                        Data de revisão ({getReviewStatus(review, date)})
                      </Text>
                    </View>
                    {isSkipped && (
                      <View style={styles.skippedIcon}>
                        <Ban size={16} color="#f43f5e" />
                      </View>
                    )}
                    {isCompleted && (
                      <View style={styles.completedCheckmark}>
                        <Check size={16} color="#22c55e" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => {
          setSelectedDate(formatDateString(new Date()));
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
        onDelete={deleteReview}
        currentDate={selectedDate}
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
  reviewSubject: {
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
  reviewItemSkipped: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reviewTextSkipped: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  skippedIcon: {
    marginLeft: 8,
  },
});
