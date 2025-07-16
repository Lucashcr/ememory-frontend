import { useSubjectsService } from '@/hooks/useSubjectsService';
import { Subject } from '@/services/subjects/types';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';

type SubjectsContextType = {
  subjects: Subject[];
  addSubject: (name: string, color: string) => Promise<void>;
  removeSubject: (id: string) => Promise<void>;
  setSubjects: (subjects: Subject[]) => void;
  isLoadingSubjects: boolean;
  error: string | null;
  fetchSubjects: () => Promise<void>;
  updateSubject: (id: string, name: string, color: string) => Promise<void>;
};

export const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const subjectsService = useSubjectsService();

  useEffect(() => {
    subjectsService.fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SubjectsContext.Provider value={subjectsService}>
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