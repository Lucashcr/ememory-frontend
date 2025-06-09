import React, { useState } from 'react';
import { Review, useReviews } from '@/contexts/ReviewsContext';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import DatePickerWrapper from '@/components/date-picker';
import api from '@/services/api';

interface RescheduleReviewModalProps {
  review: Review | undefined;
  visible: boolean;
  onClose: () => void;
}

export default function RescheduleReviewModal({
  review,
  visible,
  onClose,
}: RescheduleReviewModalProps) {
  const [newInitialDate, setNewInitialDate] = useState(new Date());
  const {fetchReviews} = useReviews();
  
  if (!review) {
    return;
  }

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
            <View style={styles.formGroup}>
              <Text style={styles.label}>Reagendar para:</Text>
            </View>
            <View style={styles.formGroup}>
              <DatePickerWrapper date={newInitialDate} setDate={setNewInitialDate} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.message}>
                Tem certeza que deseja reagendar? Todos os agendamentos para esta revisão serão atualizados, começando a partir da nova data selecionada.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.submitButton]}
              onPress={async () => {
                await api.patch(`/reviews/${review.id}/`, {
                  "initial_date": newInitialDate.toISOString().split('T')[0],
                })
                await fetchReviews();
                onClose();
              }}
            >
              <Text style={styles.submitButtonText}>Reagendar Revisão</Text>
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
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6366f1',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
