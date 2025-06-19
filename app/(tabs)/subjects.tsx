import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useSubjects } from '@/contexts/SubjectsContext';
import DeleteSubjectConfirmation from '@/components/modals/delete-subject-confirmation';
import { useReviews } from '@/contexts/ReviewsContext';
import CustomRefreshControl from '@/components/layout/refresh-control';
import { Toast } from 'toastify-react-native';
import LoadingSkeleton from '@/components/layout/loading-skeleton';
import SubjectList from '@/components/subjects/SubjectList';
import SubjectAddForm from '@/components/subjects/SubjectAddForm';

const COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#0ea5e9',
  '#6366f1',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
];

export default function Subjects() {
  const { subjects, addSubject, removeSubject, fetchSubjects, isLoadingSubjects } = useSubjects();
  const { fetchReviews } = useReviews();

  const [newSubject, setNewSubject] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleAddSubject = () => {
    const trimmedName = newSubject.trim();
    if (!trimmedName) return;

    // Verificar se já existe uma disciplina com o mesmo nome
    const duplicateName = subjects.find(
      (subject) => subject.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicateName) {
      Toast.warn(
        'Já existe uma disciplina com este nome. Por favor, escolha um nome diferente!'
      );
      return;
    }

    // Verificar se já existe uma disciplina com a mesma cor
    const duplicateColor = subjects.find(
      (subject) => subject.color === selectedColor
    );
    if (duplicateColor) {
      Toast.warn(
        'Esta cor já está sendo usada. Por favor, escolha uma cor diferente!'
      );
      return;
    }

    try {
      addSubject(trimmedName, selectedColor);
      setNewSubject('');
      setIsAdding(false);
    } catch {
      Toast.error('Ocorreu um erro ao adicionar a disciplina. Tente novamente!');
    }
  };

  const handleDeleteSubject = async () => {
    if (subjectToDelete) {
      try {
        await removeSubject(subjectToDelete.id);
        await fetchReviews();
        setSubjectToDelete(null);
      } catch {
        Toast.error('Ocorreu um erro ao excluir a disciplina. Tente novamente!');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={CustomRefreshControl({ fetchSubjects })}
      >
        {isLoadingSubjects ? (
          <LoadingSkeleton mode="subjects" />
        ) : (
          <SubjectList
            subjects={subjects}
            isLoading={isLoadingSubjects}
            onDelete={setSubjectToDelete}
          />
        )}
      </ScrollView>

      {isAdding ? (
        <SubjectAddForm
          newSubject={newSubject}
          setNewSubject={setNewSubject}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          COLORS={COLORS}
          onAdd={handleAddSubject}
        />
      ) : (
        <Pressable style={styles.addButton} onPress={() => setIsAdding(true)}>
          <Plus size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nova Disciplina</Text>
        </Pressable>
      )}

      <DeleteSubjectConfirmation
        visible={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={handleDeleteSubject}
        subjectName={subjectToDelete?.name ?? ''}
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
