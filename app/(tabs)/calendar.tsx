import CalendarGrid from '@/components/calendar/CalendarGrid';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import WeekDays from '@/components/calendar/WeekDays';
import CustomRefreshControl from '@/components/layout/refresh-control';
import FilterReviewsModal from '@/components/modals/filter-reviews';
import NewReviewModal from '@/components/modals/new-review';
import RescheduleReviewModal from '@/components/modals/reschedule-review';
import ReviewDetails from '@/components/modals/review-details';
import ReviewList from '@/components/review/ReviewList';
import { useReviews } from '@/contexts/ReviewsContext';
import {
  formatDateString,
} from '@/services/dateUtils';
import { Review } from '@/services/reviews/types';
import getReviewScheduleLabel from '@/services/reviewScheduleLabel';
import { Filter, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

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

export default function Calendar() {
  const { reviews, toggleReview, deleteReview, fetchReviews, isLoadingReviews } = useReviews();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    formatDateString(new Date())
  );
  const [newReviewModalVisible, setNewReivewModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviewDetailsVisible, setReviewDetailsVisible] = useState(false);
  const [filterReviewsModalVisible, setFilterReviewsModalVisible] =
    useState(false);
  const [reviewsFilter, setReviewsFilter] = useState({ subject: 'all' });
  const [rescheduleReviewModalVisible, setRescheduleReviewModalVisible] =
    useState(false);
  const [reschuleReview, setRescheduleReview] = useState<Review>();

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
    setNewReivewModalVisible(true);
  };

  const isReviewCompleted = (review: Review, date: string) => {
    const reviewDate = review.review_dates.find(
      (rd) => rd.scheduled_for === date
    );
    return reviewDate?.status === 'completed';
  };

  const filteredReviews = reviews.filter((review) => {
    return (
      reviewsFilter.subject === 'all' ||
      review.subject.id === reviewsFilter.subject
    );
  });

  const days = getDaysInMonth(currentDate);
  const reviewsByDate = filteredReviews.reduce(
    (acc: { [key: string]: Review[] }, review) => {
      review.review_dates.forEach((rd) => {
        const reviewDate = new Date(rd.scheduled_for + 'T00:00:00');
        if (
          reviewDate.getMonth() === currentDate.getMonth() &&
          reviewDate.getFullYear() === currentDate.getFullYear()
        ) {
          acc[rd.scheduled_for] = [...(acc[rd.scheduled_for] || []), review];
        }
      });
      return acc;
    },
    {}
  );

  const sortedReviewDates = Object.entries(reviewsByDate)
    .filter(([date]) => {
      const reviewDate = new Date(date + 'T00:00:00');
      return (
        reviewDate.getMonth() === currentDate.getMonth() &&
        reviewDate.getFullYear() === currentDate.getFullYear()
      );
    })
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={CustomRefreshControl({ fetchReviews })}
      >
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
          months={MONTHS}
        />
        <WeekDays days={DAYS} />
        <CalendarGrid
          days={days}
          reviewsByDate={reviewsByDate}
          onDayPress={handleDayPress}
        />
        <ReviewList
          isLoading={isLoadingReviews}
          sortedReviewDates={sortedReviewDates}
          isReviewCompleted={isReviewCompleted}
          getReviewScheduleLabel={getReviewScheduleLabel}
          onReviewPress={(review, date) => {
            setSelectedReview(review);
            setSelectedDate(date);
            setReviewDetailsVisible(true);
          }}
        />
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => {
          setSelectedDate(formatDateString(new Date()));
          setNewReivewModalVisible(true);
        }}
      >
        <Plus size={24} color="#fff" />
      </Pressable>

      <Pressable
        style={styles.filter}
        onPress={() => {
          setFilterReviewsModalVisible(true);
        }}
      >
        <Filter size={24} color="#fff" />
      </Pressable>

      <NewReviewModal
        visible={newReviewModalVisible}
        onClose={() => setNewReivewModalVisible(false)}
        selectedDate={selectedDate}
      />

      <FilterReviewsModal
        visible={filterReviewsModalVisible}
        onClose={() => setFilterReviewsModalVisible(false)}
        reviewsFilter={reviewsFilter}
        onConfirmReviewsFilter={setReviewsFilter}
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
        onRescheduleReview={(review) => {
          setRescheduleReview(review);
          setRescheduleReviewModalVisible(true);
        }}
      />

      <RescheduleReviewModal
        visible={rescheduleReviewModalVisible}
        onClose={() => {
          setRescheduleReview(undefined);
          setRescheduleReviewModalVisible(false);
        }}
        review={reschuleReview}
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
  filter: {
    position: 'absolute',
    left: 16,
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
