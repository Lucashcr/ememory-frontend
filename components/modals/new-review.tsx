import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { X } from 'lucide-react-native';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useReviews } from '@/contexts/ReviewsContext';
import { useSubjects } from '@/contexts/SubjectsContext';
import { formatDateToLocalString } from '@/services/dateUtils';
import { Toast } from 'toastify-react-native';

interface NewReviewModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
}

export default function NewReviewModal({
  visible,
  onClose,
  selectedDate,
}: NewReviewModalProps) {
  const { addReview } = useReviews();
  const { subjects } = useSubjects();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    try {
      const selectedSubject = subjects.find((s) => s.id === subject);
      if (selectedSubject) {
        const newReview = {
          topic: title,
          subject_id: selectedSubject.id,
          notes,
          initial_date: selectedDate,
        };

        addReview(newReview);
      }

      // Reset form and close modal
      setTitle('');
      setSubject('');
      setNotes('');
      onClose();
    } catch {
      Toast.error(
        'Ocorreu um erro ao criar a revisão. Por favor, tente novamente.'
      );
    }
  };

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
            <Text style={styles.modalTitle}>Nova Revisão</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título da revisão"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Disciplina</Text>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={subject}
                  onValueChange={(itemValue) => setSubject(itemValue)}
                  style={styles.select}
                >
                  <Picker.Item label="Selecione uma disciplina" value="" />
                  {subjects.map((s) => (
                    <Picker.Item key={s.id} label={s.name} value={s.id} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Data</Text>
              <Text style={styles.dateText}>
                {formatDateToLocalString(selectedDate)}
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Digite as observações"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
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
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Criar Revisão</Text>
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
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  dateText: {
    fontSize: 16,
    color: '#1e293b',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
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
