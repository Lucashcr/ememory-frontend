import LoadingSkeleton from '@/components/layout/loading-skeleton';
import CustomRefreshControl from '@/components/layout/refresh-control';
import DeleteSubjectConfirmation from '@/components/modals/delete-subject-confirmation';
import SubjectAddForm from '@/components/subjects/SubjectAddForm';
import SubjectList from '@/components/subjects/SubjectList';
import { useReviews } from '@/contexts/ReviewsContext';
import { useSubjects } from '@/contexts/SubjectsContext';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Toast } from 'toastify-react-native';

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
];

export default function Subjects() {
  const { subjects, addSubject, updateSubject, removeSubject, fetchSubjects, isLoadingSubjects } = useSubjects();
  const { fetchReviews } = useReviews();

  const [newSubject, setNewSubject] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [subjectToDelete, setSubjectToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingSubject, setEditingSubject] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const handleAddSubject = async () => {
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
      await addSubject(trimmedName, selectedColor);
      setNewSubject('');
      setSelectedColor(COLORS[0]);
      setFormVisible(false);
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

  const handleEditSubject = (subject: { id: string; name: string; color: string }) => {
    setEditingSubject(subject);
    setNewSubject(subject.name);
    setSelectedColor(subject.color);
    setFormVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSubject) return;
    const trimmedName = newSubject.trim();
    if (!trimmedName) return;

    // Verificar se já existe uma disciplina com o mesmo nome (exceto a atual)
    const duplicateName = subjects.find(
      (subject) => subject.name.toLowerCase() === trimmedName.toLowerCase() && subject.id !== editingSubject.id
    );
    if (duplicateName) {
      Toast.warn('Já existe uma disciplina com este nome. Por favor, escolha um nome diferente!');
      return;
    }
    // Verificar se já existe uma disciplina com a mesma cor (exceto a atual)
    const duplicateColor = subjects.find(
      (subject) => subject.color === selectedColor && subject.id !== editingSubject.id
    );
    if (duplicateColor) {
      Toast.warn('Esta cor já está sendo usada. Por favor, escolha uma cor diferente!');
      return;
    }
    try {
      await updateSubject(editingSubject.id, trimmedName, selectedColor);
      await fetchSubjects();
      setEditingSubject(null);
      setNewSubject('');
      setSelectedColor(COLORS[0]);
      setFormVisible(false);
    } catch {
      Toast.error('Ocorreu um erro ao editar a disciplina. Tente novamente!');
    }
  };

  const handleCancelForm = () => {
    setEditingSubject(null);
    setNewSubject('');
    setSelectedColor(COLORS[0]);
    setFormVisible(false);
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
            onEdit={handleEditSubject}
          />
        )}
      </ScrollView>

      {!formVisible && (
        <Pressable
          style={styles.fab}
          onPress={() => setFormVisible(true)}
          accessibilityLabel="Adicionar nova disciplina"
        >
          <Plus size={24} color="#fff" />
        </Pressable>
      )}
      {formVisible && (
        <SubjectAddForm
          newSubject={newSubject}
          setNewSubject={setNewSubject}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          COLORS={COLORS}
          onAdd={editingSubject ? handleSaveEdit : handleAddSubject}
          onCancel={handleCancelForm}
          addButtonText={editingSubject ? 'Confirmar' : 'Adicionar'}
        />
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
