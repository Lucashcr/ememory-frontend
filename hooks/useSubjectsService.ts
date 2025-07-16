import { subjectsService } from '@/services/subjects/subjectsService';
import { ISubjectsService, Subject } from '@/services/subjects/types';
import { useCallback, useState } from 'react';
import { Toast } from 'toastify-react-native';

export function useSubjectsService(service: ISubjectsService = subjectsService) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    setIsLoadingSubjects(true);
    setError(null);
    try {
      const data = await service.fetchSubjects();
      setSubjects(data);
    } catch (err) {
      setError('Failed to fetch subjects');
      console.error('Error fetching subjects:', err);
      Toast.error('Erro ao carregar matérias');
    } finally {
      setIsLoadingSubjects(false);
    }
  }, [service]);

  const addSubject = useCallback(async (name: string, color: string) => {
    setIsLoadingSubjects(true);
    setError(null);
    try {
      const newSubject = await service.addSubject({ name, color });
      setSubjects(prev => [...prev, newSubject]);
      Toast.success('Matéria adicionada com sucesso!');
    } catch (err) {
      setError('Failed to add subject');
      console.error('Error adding subject:', err);
      Toast.error('Erro ao adicionar matéria');
      throw err;
    } finally {
      setIsLoadingSubjects(false);
    }
  }, [service]);

  const removeSubject = useCallback(async (id: string) => {
    setIsLoadingSubjects(true);
    setError(null);
    try {
      await service.removeSubject(id);
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      Toast.success('Matéria removida com sucesso!');
    } catch (err) {
      setError('Failed to remove subject');
      console.error('Error removing subject:', err);
      Toast.error('Erro ao remover matéria');
      throw err;
    } finally {
      setIsLoadingSubjects(false);
    }
  }, [service]);

  const updateSubject = useCallback(async (id: string, name: string, color: string) => {
    setIsLoadingSubjects(true);
    setError(null);
    try {
      const updatedSubject = await service.updateSubject({ id, name, color });
      setSubjects(prev => prev.map(subject =>
        subject.id === id ? updatedSubject : subject
      ));
      Toast.success('Matéria atualizada com sucesso!');
    } catch (err) {
      setError('Failed to update subject');
      console.error('Error updating subject:', err);
      Toast.error('Erro ao atualizar matéria');
      throw err;
    } finally {
      setIsLoadingSubjects(false);
    }
  }, [service]);

  return {
    subjects,
    setSubjects,
    isLoadingSubjects,
    error,
    fetchSubjects,
    addSubject,
    removeSubject,
    updateSubject,
  };
}
