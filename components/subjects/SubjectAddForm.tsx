import ColorPickerModal from '@/components/modals/color-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface SubjectAddFormProps {
  newSubject: string;
  setNewSubject: (value: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  COLORS: string[];
  onAdd: () => void;
  onCancel: () => void;
  addButtonText?: string;
}

const SubjectAddForm: React.FC<SubjectAddFormProps> = ({
  newSubject,
  setNewSubject,
  selectedColor,
  setSelectedColor,
  COLORS,
  onAdd,
  onCancel,
  addButtonText = 'Adicionar',
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <View style={styles.addForm}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={[styles.selectedColorSquare, { backgroundColor: selectedColor }]} />
        <TextInput
          style={styles.input}
          value={newSubject}
          onChangeText={setNewSubject}
          placeholder="Nome da disciplina"
          autoFocus
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.colorPicker}
      >
        {COLORS.map((color) => (
          <Pressable
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.colorOptionSelected,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
        <Pressable
          style={[
            styles.colorOption,
            {
              padding: 0,
              borderWidth: 1,
              borderColor: '#cbd5e1',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            },
            selectedColor &&
              !COLORS.includes(selectedColor) &&
              styles.colorOptionSelected,
          ]}
          onPress={() => setShowColorPicker(true)}
        >
          <LinearGradient
            colors={[
              '#ef4444',
              '#f59e0b',
              '#22c55e',
              '#0ea5e9',
              '#a855f7',
              '#f43f5e',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.customColorOption}
          >
            <Text style={styles.customColorOptionText}>+</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
        </Pressable>
        <Pressable style={styles.addButton} onPress={onAdd}>
          <Text style={[styles.buttonText, styles.confirmButtonText]}>{addButtonText}</Text>
        </Pressable>
      </View>
      <ColorPickerModal
        visible={showColorPicker}
        initialColor={selectedColor}
        onSelect={(color) => {
          setSelectedColor(color);
          setShowColorPicker(false);
        }}
        onClose={() => setShowColorPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addForm: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    flex: 1,
    marginBottom: 0,
    marginLeft: 12
  },
  colorPicker: {
    flexDirection: 'row',
    paddingBottom: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  customColorOption: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customColorOptionText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    textShadowColor: '#0006',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  addButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
  },
  cancelButtonText: {
    color: '#64748b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: 300,
    height: 350,
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#6366f1',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    width: 120,
  },
  selectedColorSquare: {
    width: 49,
    height: 49,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
});

export default SubjectAddForm;
