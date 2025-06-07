import { useSubjects } from '@/contexts/SubjectsContext';
import { Picker } from '@react-native-picker/picker';
import { X } from 'lucide-react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ReviewsFilter = {
  subject: string;
};

interface FilterReviewsProps {
  visible: boolean;
  onClose: () => void;
  reviewsFilter: ReviewsFilter;
  onConfirmReviewsFilter: Dispatch<SetStateAction<ReviewsFilter>>;
}

export default function FilterReviewsModal({
  visible,
  onClose,
  reviewsFilter,
  onConfirmReviewsFilter,
}: FilterReviewsProps) {
  const { subjects } = useSubjects();
  const [subject, setSubject] = useState<string>(reviewsFilter.subject || '');

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar revisões</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Disciplina</Text>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={subject}
                  onValueChange={(itemValue) => setSubject(itemValue)}
                  style={styles.select}
                >
                  <Picker.Item label="Todas as disciplinas" value="" />
                  {subjects.map((s) => (
                    <Picker.Item key={s.id} label={s.name} value={s.id} />
                  ))}
                </Picker>
              </View>
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
              onPress={() => {
                onConfirmReviewsFilter({ ...reviewsFilter, subject });
                onClose();
              }}
            >
              <Text style={styles.submitButtonText}>Filtrar Revisões</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
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
  selectContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  select: {
    width: '100%',
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1e293b',
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
