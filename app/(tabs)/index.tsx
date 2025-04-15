import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import ReviewDetails from '@/components/modals/review-details';

// Mock data for daily reviews
const mockReviews = [
  {
    id: '1',
    topic: 'Funções Quadráticas',
    subject: 'Matemática',
    color: '#ef4444',
    notes: 'Revisar gráficos de funções quadráticas e suas propriedades. Focar em vértice, concavidade e raízes.',
  },
  {
    id: '2',
    topic: 'Leis de Newton',
    subject: 'Física',
    color: '#3b82f6',
    notes: 'Estudar as três leis de Newton e suas aplicações práticas. Resolver exercícios de força e movimento.',
  },
  {
    id: '3',
    topic: 'Tabela Periódica',
    subject: 'Química',
    color: '#22c55e',
    notes: 'Memorizar as principais famílias e suas características. Revisar propriedades periódicas.',
  },
];

export default function DailyReviews() {
  const [completedReviews, setCompletedReviews] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<typeof mockReviews[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleReview = (id: string) => {
    setCompletedReviews(prev =>
      prev.includes(id)
        ? prev.filter(reviewId => reviewId !== id)
        : [...prev, id]
    );
  };

  const openReviewDetails = (review: typeof mockReviews[0]) => {
    setSelectedReview(review);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {mockReviews.map(review => (
          <Pressable
            key={review.id}
            style={[styles.reviewItem]}
            onPress={() => openReviewDetails(review)}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleReview(review.id);
              }}
              style={styles.checkboxContainer}>
              <View style={[styles.checkbox, completedReviews.includes(review.id) && styles.checkboxChecked]}>
                {completedReviews.includes(review.id) && (
                  <Check size={16} color="#fff" />
                )}
              </View>
            </Pressable>
            <View style={styles.reviewContent}>
              <View style={[styles.subjectIndicator, { backgroundColor: review.color }]} />
              <View>
                <Text style={styles.topicText}>{review.topic}</Text>
                <Text style={styles.subjectText}>{review.subject}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <ReviewDetails
        review={selectedReview}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isCompleted={selectedReview ? completedReviews.includes(selectedReview.id) : false}
        onToggleComplete={toggleReview}
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
});