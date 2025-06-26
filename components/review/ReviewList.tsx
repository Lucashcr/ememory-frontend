import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check, Ban } from 'lucide-react-native';
import LoadingSkeleton from '@/components/layout/loading-skeleton';

interface ReviewListProps {
  isLoading: boolean;
  sortedReviewDates: [string, any[]][];
  isReviewCompleted: (review: any, date: string) => boolean;
  getReviewScheduleLabel: (review: any, date: string) => string;
  onReviewPress: (review: any, date: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  isLoading,
  sortedReviewDates,
  isReviewCompleted,
  getReviewScheduleLabel,
  onReviewPress,
}) => (
  <View style={{ padding: 4, marginTop: 16 }}>
    {isLoading ? (
      <LoadingSkeleton mode="review" />
    ) : (
      sortedReviewDates.map(([date, dateReviews]) => (
        <View key={date} style={styles.dateReviews}>
          <Text style={styles.dateText}>{date}</Text>
          {dateReviews.map((review, index) => {
            const isCompleted = isReviewCompleted(review, date);
            const isSkipped =
              review.review_dates.find((rd: any) => rd.scheduled_for === date)?.status === 'skipped';
            return (
              <Pressable
                key={`${review.id}-${index}`}
                style={[
                  styles.reviewItem,
                  isCompleted && styles.reviewItemCompleted,
                  isSkipped && styles.reviewItemSkipped,
                ]}
                onPress={() => onReviewPress(review, date)}
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
                    {getReviewScheduleLabel(review, date)}
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
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
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
  reviewDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
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

export default ReviewList;
