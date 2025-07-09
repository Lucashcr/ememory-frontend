import { useReviews } from '@/contexts/ReviewsContext';
import { Pencil, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface SubjectListProps {
  subjects: Subject[];
  isLoading: boolean;
  onDelete: (subject: { id: string; name: string }) => void;
  onEdit: (subject: { id: string; name: string; color: string }) => void;
}

const MAX_HEIGHT = 999;

// Componente para cada card de disciplina
const SubjectCard: React.FC<{
  subject: Subject;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: { id: string; name: string }) => void;
  reviews: any[];
  registerRef?: (ref: any) => void;
}> = ({ subject, isOpen, onToggle, onEdit, onDelete, reviews, registerRef }) => {
  const animation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  // Métodos para animação controlada pelo pai
  const animateOpen = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 750,
      useNativeDriver: false,
      easing: Easing.in(Easing.ease),
    }).start();
  };
  const animateClose = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 350,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  // Registra métodos no pai
  React.useEffect(() => {
    if (registerRef) registerRef({ animateOpen, animateClose });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerRef]);

  return (
    <View style={styles.subjectContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.subjectItem,
          pressed && { backgroundColor: '#f1f5f9' },
        ]}
        onPress={onToggle}
      >
        <View style={[styles.colorIndicator, { backgroundColor: subject.color }]} />
        <Text style={styles.subjectName}>{subject.name}</Text>
        <Pressable
          onPress={() => onEdit(subject)}
          style={styles.iconButton}
          hitSlop={8}
        >
          <Pencil size={20} color="#64748b" />
        </Pressable>
        <Pressable
          onPress={() => onDelete({ id: subject.id, name: subject.name })}
          style={styles.iconButton}
          hitSlop={8}
        >
          <X size={20} color="#64748b" />
        </Pressable>
      </Pressable>
      <Animated.View
        style={{
          overflow: 'hidden',
          maxHeight: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, MAX_HEIGHT],
          }),
        }}
      >
        <View style={styles.topicsContainer}>
          {reviews.length ? (
            reviews.map((review) => (
              <View key={review.id} style={styles.topicCard}>
                <Text style={styles.topicText}>{review.topic}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noActivityText}>Nenhuma atividade</Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  isLoading,
  onDelete,
  onEdit,
}) => {
  const { reviews } = useReviews();
  const [openedSubjectId, setOpenedSubjectId] = useState<string | null>(null);
  const cardRefs = useRef<{ [id: string]: { animateOpen: () => void; animateClose: () => void } }>({});

  const registerCardRef = (id: string, ref: any) => {
    cardRefs.current[id] = ref;
  };

  // Função para alternar cards com animação simultânea
  const handleToggle = (subjectId: string) => {
    if (openedSubjectId && openedSubjectId !== subjectId) {
      cardRefs.current[subjectId]?.animateOpen();
      cardRefs.current[openedSubjectId]?.animateClose();
      setOpenedSubjectId(subjectId);
    } else if (openedSubjectId === subjectId) {
      cardRefs.current[subjectId]?.animateClose();
      setOpenedSubjectId(null);
    } else {
      cardRefs.current[subjectId]?.animateOpen();
      setOpenedSubjectId(subjectId);
    }
  };

  if (isLoading) return null;

  return (
    <>
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          isOpen={openedSubjectId === subject.id}
          onToggle={() => handleToggle(subject.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          reviews={reviews.filter((review) => review.subject.id === subject.id)}
          registerRef={(ref: any) => registerCardRef(subject.id, ref)}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  subjectContainer: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
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
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
  topicsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#f1f5f9',
    borderBottomEndRadius: 14,
  },
  topicCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  topicText: {
    color: '#334155',
    fontSize: 15,
  },
  noActivityText: {
    color: '#64748b',
    fontStyle: 'italic',
    paddingVertical: 8,
    textAlign: 'center',
  },
});

export default SubjectList;
