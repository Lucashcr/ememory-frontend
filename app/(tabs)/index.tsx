import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import ReviewDetails from '@/components/modals/review-details';
import { useReviews, Review } from '@/contexts/ReviewsContext';

export default function DailyReviews() {
  const { reviews, isReviewCompleted, toggleReview, formatDate } = useReviews();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const today = new Date();
  const todayStr = formatDate(today);
  
  const dailyReviews = reviews.filter(review => 
    review.review_dates.some(rd => rd.scheduled_for === todayStr && rd.status === 'pending')
  );

  const getReviewStatus = (review: Review, date: string) => {
    const reviewIndex = review.review_dates.findIndex(rd => rd.scheduled_for === date);
    switch (reviewIndex) {
      case 0:
        return 'Inicial';
      case 1:
        return '1 dia';
      case 2:
        return '7 dias';
      case 3:
        return '15 dias';
      case 4:
        return '30 dias';
      case 5:
        return '60 dias';
      default:
        return '';
    }
  };

  const reviewTypeText = (review: Review) => {
    return `Data de revisão (${getReviewStatus(review, todayStr)})`;
  };

  const openReviewDetails = (review: Review) => {
    setSelectedReview(review);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {dailyReviews.map(review => (
          <Pressable
            key={review.id}
            style={[styles.reviewItem]}
            onPress={() => openReviewDetails(review)}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleReview(review);
              }}
              style={styles.checkboxContainer}>
              <View style={[styles.checkbox, isReviewCompleted(review) && styles.checkboxChecked]}>
                {isReviewCompleted(review) && (
                  <Check size={16} color="#fff" />
                )}
              </View>
            </Pressable>
            <View style={styles.reviewContent}>
              <View style={[styles.subjectIndicator, { backgroundColor: review.subject.color }]} />
              <View>
                <Text style={styles.topicText}>{review.topic}</Text>
                <Text style={styles.subjectText}>{review.subject.name}</Text>
                <Text style={styles.reviewTypeText}>{reviewTypeText(review)}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <ReviewDetails
        review={selectedReview}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onToggleComplete={(id) => {
          const review = dailyReviews.find(r => r.id === id);
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
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
});