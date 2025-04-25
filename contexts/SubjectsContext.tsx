import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Subject = {
  id: string;
  name: string;
  color: string;
};

type SubjectsContextType = {
  subjects: Subject[];
  addSubject: (name: string, color: string) => void;
  removeSubject: (id: string) => void;
};

const initialSubjects: Subject[] = [];

export const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  const addSubject = (name: string, color: string) => {
    setSubjects(prev => [...prev, {
      id: Date.now().toString(),
      name,
      color,
    }]);
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  const value = {
    subjects,
    addSubject,
    removeSubject,
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