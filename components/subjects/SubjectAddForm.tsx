import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';

interface SubjectAddFormProps {
  newSubject: string;
  setNewSubject: (value: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  COLORS: string[];
  onAdd: () => void;
}

const SubjectAddForm: React.FC<SubjectAddFormProps> = ({
  newSubject,
  setNewSubject,
  selectedColor,
  setSelectedColor,
  COLORS,
  onAdd,
}) => (
  <View style={styles.addForm}>
    <TextInput
      style={styles.input}
      value={newSubject}
      onChangeText={setNewSubject}
      placeholder="Nome da disciplina"
      autoFocus
    />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
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
    </ScrollView>
    <Pressable style={styles.addButton} onPress={onAdd}>
      <Text style={styles.addButtonText}>Adicionar Disciplina</Text>
    </Pressable>
  </View>
);

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
    marginBottom: 12,
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
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SubjectAddForm;
