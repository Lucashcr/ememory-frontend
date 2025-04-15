import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Review = {
  id: string;
  subject: string;
  topic: string;
  color: string;
  notes: string;
};

type ReviewsContextType = {
  reviews: Record<string, Review[]>;
  completedReviews: string[];
  isReviewCompleted: (review: Review, date: string) => boolean;
  toggleReview: (date: string, review: Review) => void;
  addReview: (date: string, review: Review) => void;
  getDailyReviews: (date: Date) => Review[];
  formatDate: (date: Date) => string;
};

const mockReviews: Record<string, Review[]> = {
  '2025-04-15': [
    {
      id: '1',
      subject: 'Matemática',
      topic: 'Funções Quadráticas',
      color: '#ef4444',
      notes: 'Revisar gráficos de funções quadráticas e suas propriedades. Focar em vértice, concavidade e raízes.',
    },
    {
      id: '2',
      subject: 'Física',
      topic: 'Leis de Newton',
      color: '#3b82f6',
      notes: 'Estudar as três leis de Newton e suas aplicações práticas. Resolver exercícios de força e movimento.',
    },
  ],
  '2025-04-20': [
    {
      id: '3',
      subject: 'Química',
      topic: 'Tabela Periódica',
      color: '#22c55e',
      notes: 'Memorizar as principais famílias e suas características. Revisar propriedades periódicas.',
    },
  ],
};

export const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState(mockReviews);
  const [completedReviews, setCompletedReviews] = useState<string[]>([]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isReviewCompleted = (review: Review, date: string) => {
    return completedReviews.includes(`${date}-${review.id}`);
  };

  const toggleReview = (date: string, review: Review) => {
    const reviewId = `${date}-${review.id}`;
    setCompletedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const addReview = (date: string, review: Review) => {
    setReviews(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), review],
    }));
  };

  const getDailyReviews = (date: Date) => {
    return reviews[formatDate(date)] || [];
  };

  const value = {
    reviews,
    completedReviews,
    isReviewCompleted,
    toggleReview,
    addReview,
    getDailyReviews,
    formatDate,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}