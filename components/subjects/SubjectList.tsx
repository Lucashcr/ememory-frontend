import { X } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface SubjectListProps {
  subjects: Subject[];
  isLoading: boolean;
  onDelete: (subject: { id: string; name: string }) => void;
  onEdit?: (subject: { id: string; name: string; color: string }) => void;
}

const SubjectList: React.FC<SubjectListProps> = ({ subjects, isLoading, onDelete, onEdit }) => {
  if (isLoading) return null;
  return (
    <>
      {subjects.map((subject) => (
        <Pressable
          key={subject.id}
          style={styles.subjectItem}
          onPress={onEdit ? () => onEdit(subject) : undefined}
        >
          <View style={[styles.colorIndicator, { backgroundColor: subject.color }]} />
          <Text style={styles.subjectName}>{subject.name}</Text>
          <Pressable onPress={() => onDelete({ id: subject.id, name: subject.name })} style={styles.removeButton} hitSlop={8}>
            <X size={20} color="#64748b" />
          </Pressable>
        </Pressable>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
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
});

export default SubjectList;
