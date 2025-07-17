import CustomRefreshControl from '@/components/layout/refresh-control';
import NewReviewModal from '@/components/modals/new-review';
import ReviewDetails from '@/components/modals/review-details';
import ReviewListDaily from '@/components/review/ReviewListDaily';
import { useReviews } from '@/contexts/ReviewsContext';
import { formatDateString, getCurrentDate } from '@/services/dateUtils';
import { Review } from '@/services/reviews/types';
import getReviewScheduleLabel from '@/services/reviewScheduleLabel';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function DailyReviews() {
  const {
    reviews,
    isReviewCompleted,
    toggleReview,
    deleteReview,
    fetchReviews,
    isLoadingReviews,
  } = useReviews();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [newReviewModalVisible, setNewReviewModalVisible] = useState(false);
  const [reviewDetailsModalVisible, setReviewDetailsModalVisible] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState(
    formatDateString(new Date())
  );

  const today = getCurrentDate();
  const dailyReviews = reviews.filter((review) =>
    review.review_dates.some((rd) => rd.scheduled_for === today)
  );

  const openReviewDetails = (review: Review) => {
    setSelectedReview(review);
    setReviewDetailsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={CustomRefreshControl({fetchReviews})}
      >
        <ReviewListDaily
          isLoading={isLoadingReviews}
          reviews={dailyReviews}
          today={today}
          isReviewCompleted={isReviewCompleted}
          getReviewScheduleLabel={getReviewScheduleLabel}
          onReviewPress={openReviewDetails}
          onToggleReview={toggleReview}
        />
      </ScrollView>

      <ReviewDetails
        review={selectedReview}
        visible={reviewDetailsModalVisible}
        onClose={() => setReviewDetailsModalVisible(false)}
        onDelete={deleteReview}
        onToggleComplete={(id) => {
          const review = dailyReviews.find((r) => r.id === id);
          if (review) {
            toggleReview(review);
          }
        }}
        currentDate={today}
        onRescheduleReview={() => {}}
      />

      <Pressable
        style={styles.fab}
        onPress={() => {
          setSelectedDate(formatDateString(new Date()));
          setNewReviewModalVisible(true);
        }}
      >
        <Plus size={24} color="#fff" />
      </Pressable>

      <NewReviewModal
        visible={newReviewModalVisible}
        onClose={() => setNewReviewModalVisible(false)}
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
  scrollView: {
    flex: 1,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewItemCompleted: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  reviewContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  topicText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  subjectText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  reviewTypeText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  checkboxContainerDisabled: {
    opacity: 0.5,
  },
  checkboxDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  reviewTextCompleted: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
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
