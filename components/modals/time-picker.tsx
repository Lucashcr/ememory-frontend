import { Picker } from '@react-native-picker/picker';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (hour: number, minute: number) => void;
  currentTime: { hour: number; minute: number };
}

export default function TimePickerModal({
  visible,
  onClose,
  onSave,
  currentTime,
}: TimePickerModalProps) {
  const [selectedHour, setSelectedHour] = useState(currentTime.hour.toString() || "0");
  const [selectedMinute, setSelectedMinute] = useState(currentTime.minute.toString() || "0");

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

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
            <Text style={styles.modalTitle}>Horário da Notificação</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <View style={styles.timePickerContainer}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Hora</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={selectedHour}
                  onValueChange={setSelectedHour}
                >
                  {hours.map((hour) => (
                    <Picker.Item
                      key={hour}
                      label={formatNumber(hour)}
                      value={hour.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Minuto</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={selectedMinute}
                  onValueChange={setSelectedMinute}
                >
                  {minutes.map((minute) => (
                    <Picker.Item
                      key={minute}
                      label={formatNumber(minute)}
                      value={minute.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={() => {
                onSave(parseInt(selectedHour), parseInt(selectedMinute));
                onClose();
              }}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
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
    maxWidth: 400,
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
  timePickerContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
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
  saveButton: {
    backgroundColor: '#6366f1',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});