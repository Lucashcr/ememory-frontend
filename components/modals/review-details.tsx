import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";
import { Review } from "@/contexts/ReviewsContext";

export interface ReviewDetailsProps {
  review: Review | null;
  visible: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
}

export default function ReviewDetails({ review, visible, onClose, isCompleted, onToggleComplete }: ReviewDetailsProps) {
  if (!review) return null;

  const getReviewStatus = (initialDate: string, reviewDates: string[], date: string) => {
    if (date === initialDate) {
      return 'Inicial';
    }
    const reviewIndex = reviewDates.indexOf(date);
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={[styles.subjectIndicator, { backgroundColor: review.subject.color }]} />
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>{review.topic}</Text>
              <Text style={styles.modalSubject}>{review.subject.name}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </Pressable>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.notesLabel}>Observações:</Text>
            <Text style={styles.notesText}>{review.notes}</Text>
            
            <Text style={[styles.notesLabel, { marginTop: 16 }]}>Data inicial:</Text>
            <Text style={styles.dateText}>
              {new Date(review.initialDate).toLocaleDateString('pt-BR', { timeZone: '+00:00' })} ({getReviewStatus(review.initialDate, review.reviewDates, review.initialDate)})
            </Text>

            <Text style={[styles.notesLabel, { marginTop: 16 }]}>Datas de revisão:</Text>
            {review.reviewDates.map((date, index) => (
              <Text key={index} style={styles.dateText}>
                {new Date(date).toLocaleDateString('pt-BR', { timeZone: '+00:00' })} ({getReviewStatus(review.initialDate, review.reviewDates, date)})
              </Text>
            ))}
          </View>
          <View style={styles.modalFooter}>
            <Pressable
              style={[styles.completeButton, isCompleted && styles.completeButtonActive]}
              onPress={() => onToggleComplete(review.id)}>
              <Check size={20} color={isCompleted ? '#fff' : '#6366f1'} />
              <Text style={[styles.completeButtonText, isCompleted && styles.completeButtonTextActive]}>
                {isCompleted ? 'Concluída' : 'Marcar como concluída'}
              </Text>
            </Pressable>
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
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 12,
    padding: 12,
  },
  completeButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: 8,
  },
  completeButtonTextActive: {
    color: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 4,
  },
});