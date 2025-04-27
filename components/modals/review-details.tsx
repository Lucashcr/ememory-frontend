import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { formatDateToLocalString, getCurrentDate } from '@/services/dateUtils';
import type { Review } from '@/contexts/ReviewsContext';

interface ReviewDetailsProps {
  review: Review | null;
  visible: boolean;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  currentDate?: string;
}

export default function ReviewDetails({
  review,
  visible,
  onClose,
  onToggleComplete,
  currentDate,
}: ReviewDetailsProps) {
  if (!review || !currentDate) return null;

  const reviewDate = review.review_dates.find(
    (rd) => rd.scheduled_for === currentDate
  );
  const isCompleted = reviewDate?.status === 'completed';
  const isPending = reviewDate?.status === 'pending';

  const today = getCurrentDate();
  const canToggleComplete = isPending && currentDate === today;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View
              style={[
                styles.subjectIndicator,
                { backgroundColor: review.subject.color },
              ]}
            />
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>{review.topic}</Text>
              <Text style={styles.modalSubject}>{review.subject.name}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </Pressable>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.notesLabel}>Observações:</Text>
            <Text style={styles.notesText}>{review.notes}</Text>

            <Text style={[styles.notesLabel, { marginTop: 16 }]}>
              Datas de revisão:
            </Text>
            {review.review_dates.map((date, index) => (
              <View
                key={index}
                style={[
                  styles.dateRow,
                  date.scheduled_for === currentDate && styles.currentDateRow,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    (date.status === 'completed' ||
                      date.status === 'skipped') &&
                      styles.completedDateText,
                    date.scheduled_for === currentDate &&
                      styles.currentDateText,
                  ]}
                >
                  {formatDateToLocalString(date.scheduled_for)} ({date.status})
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.modalFooter}>
            {isPending && (
              <Pressable
                style={[
                  styles.completeButton,
                  isCompleted && styles.completeButtonActive,
                  !canToggleComplete && styles.completeButtonDisabled,
                ]}
                onPress={() => {
                  onToggleComplete(review.id);
                  onClose();
                }}
                disabled={!canToggleComplete}
              >
                <Text
                  style={[
                    styles.completeButtonText,
                    isCompleted && styles.completeButtonTextActive,
                    !canToggleComplete && styles.completeButtonTextDisabled,
                  ]}
                >
                  {isCompleted ? 'Concluída' : 'Marcar como concluída'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  subjectIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalSubject: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  modalFooter: {
    padding: 16,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
  },
  completeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  completeButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  completeButtonDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    opacity: 0.5,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  completeButtonTextActive: {
    color: '#fff',
  },
  completeButtonTextDisabled: {
    color: '#94a3b8',
  },
  skipButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f43f5e',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skipButtonActive: {
    backgroundColor: '#f43f5e',
    borderColor: '#f43f5e',
  },
  dateRow: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  currentDateRow: {
    backgroundColor: '#e3e1f1',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  dateText: {
    fontSize: 16,
    color: '#64748b',
  },
  currentDateText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  completedDateText: {
    textDecorationLine: 'line-through',
  },
});
