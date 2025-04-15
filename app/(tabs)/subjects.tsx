import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { useSubjects } from '@/contexts/SubjectsContext';

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#22c55e', '#14b8a6', '#0ea5e9', '#6366f1',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
];

export default function Subjects() {
  const { subjects, addSubject, removeSubject } = useSubjects();
  const [newSubject, setNewSubject] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      addSubject(newSubject.trim(), selectedColor);
      setNewSubject('');
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {subjects.map(subject => (
          <View key={subject.id} style={styles.subjectItem}>
            <View style={[styles.colorIndicator, { backgroundColor: subject.color }]} />
            <Text style={styles.subjectName}>{subject.name}</Text>
            <Pressable
              onPress={() => removeSubject(subject.id)}
              style={styles.removeButton}>
              <X size={20} color="#64748b" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {isAdding ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            value={newSubject}
            onChangeText={setNewSubject}
            placeholder="Nome da disciplina"
            autoFocus
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
            {COLORS.map(color => (
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
          <Pressable style={styles.addButton} onPress={handleAddSubject}>
            <Text style={styles.addButtonText}>Adicionar Disciplina</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.addButton} onPress={() => setIsAdding(true)}>
          <Plus size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nova Disciplina</Text>
        </Pressable>
      )}
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
  subjectItem: {
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
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  subjectName: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  removeButton: {
    padding: 4,
  },
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
    marginBottom: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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