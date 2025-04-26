import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/services/api';

export type Subject = {
  id: string;
  name: string;
  color: string;
};

type SubjectsContextType = {
  subjects: Subject[];
  addSubject: (name: string, color: string) => Promise<void>;
  removeSubject: (id: string) => Promise<void>;
  setSubjects: (subjects: Subject[]) => void;
  isLoading: boolean;
  error: string | null;
};

const initialSubjects: Subject[] = [];

export const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/reviews/subjects/');
        setSubjects(response.data);
      } catch (err) {
        setError('Failed to fetch subjects');
        console.error('Error fetching subjects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const addSubject = async (name: string, color: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/reviews/subjects/', {
        name,
        color,
      });
      setSubjects(prev => [...prev, response.data]);
    } catch (err) {
      setError('Failed to add subject');
      console.error('Error adding subject:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubject = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/reviews/subjects/${id}/`);
      setSubjects(prev => prev.filter(subject => subject.id !== id));
    } catch (err) {
      setError('Failed to remove subject');
      console.error('Error removing subject:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    subjects,
    addSubject,
    removeSubject,
    setSubjects,
    isLoading,
    error,
  };

  return (
    <SubjectsContext.Provider value={value}>
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectsProvider');
  }
  return context;
}