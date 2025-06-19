import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import LoadingSkeleton from '@/components/layout/loading-skeleton';

interface ReviewListDailyProps {
  isLoading: boolean;
  reviews: any[];
  today: string;
  isReviewCompleted: (review: any) => boolean;
  getReviewScheduleLabel: (review: any, date: string) => string;
  onReviewPress: (review: any) => void;
  onToggleReview: (review: any) => void;
}

const ReviewListDaily: React.FC<ReviewListDailyProps> = ({
  isLoading,
  reviews,
  today,
  isReviewCompleted,
  getReviewScheduleLabel,
  onReviewPress,
  onToggleReview,
}) => (
  <View>
    {isLoading ? (
      <LoadingSkeleton mode="review" />
    ) : (
      reviews.map((review) => {
        const reviewDate = review.review_dates.find((rd: any) => rd.scheduled_for === today);
        const isSkipped = reviewDate?.status === 'skipped';
        const isPending = reviewDate?.status === 'pending';
        const completed = isReviewCompleted(review);
        if (!isSkipped) {
          return (
            <Pressable
              key={review.id}
              style={[
                styles.reviewItem,
                completed && styles.reviewItemCompleted
              ]}
              onPress={() => onReviewPress(review)}>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  if (isPending || completed) {
                    onToggleReview(review);
                  }
                }}
                style={[
                  styles.checkboxContainer,
                  !isPending && !completed && styles.checkboxContainerDisabled
                ]}>
                <View style={[
                  styles.checkbox,
                  completed && styles.checkboxChecked,
                  !isPending && !completed && styles.checkboxDisabled,
                ]}>
                  {completed && (
                    <Check size={16} color="#fff" />
                  )}
                </View>
              </Pressable>
              <View style={styles.reviewContent}>
                <View style={[styles.subjectIndicator, { backgroundColor: review.subject.color }]} />
                <View>
                  <Text style={[
                    styles.topicText,
                    completed && styles.reviewTextCompleted
                  ]}>{review.topic}</Text>
                  <Text style={[
                    styles.subjectText,
                    completed && styles.reviewTextCompleted
                  ]}>{review.subject.name}</Text>
                  <Text style={[
                    styles.reviewTypeText,
                    completed && styles.reviewTextCompleted
                  ]}>{`Data de revisão (${getReviewScheduleLabel(review, today)})`}</Text>
                </View>
              </View>
            </Pressable>
          );
        }
        return null;
      })
    )}
  </View>
);

const styles = StyleSheet.create({
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
});

export default ReviewListDaily;
