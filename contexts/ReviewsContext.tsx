import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Review = {
  id: string;
  topic: string;
  subject: {
    name: string;
    color: string;
  };
  notes: string;
  date: string;
};

type ReviewsContextType = {
  reviews: Review[];
  completedReviews: string[];
  isReviewCompleted: (review: Review) => boolean;
  toggleReview: (review: Review) => void;
  addReview: (review: Review) => void;
  getDailyReviews: (date: Date) => Review[];
  formatDate: (date: Date) => string;
};

const mockReviews: Review[] = [
  {
    id: '1',
    topic: 'Funções Quadráticas',
    subject: {
      name: 'Matemática',
      color: '#ef4444'
    },
    notes: 'Revisar gráficos de funções quadráticas e suas propriedades. Focar em vértice, concavidade e raízes.',
    date: '2025-04-15'
  },
  {
    id: '2',
    topic: 'Leis de Newton',
    subject: {
      name: 'Física',
      color: '#3b82f6'
    },
    notes: 'Estudar as três leis de Newton e suas aplicações práticas. Resolver exercícios de força e movimento.',
    date: '2025-04-15'
  },
  {
    id: '3',
    topic: 'Tabela Periódica',
    subject: {
      name: 'Química',
      color: '#22c55e'
    },
    notes: 'Memorizar as principais famílias e suas características. Revisar propriedades periódicas.',
    date: '2025-04-16'
  },
];

export const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [completedReviews, setCompletedReviews] = useState<string[]>([]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isReviewCompleted = (review: Review) => {
    return completedReviews.includes(`${review.date}-${review.id}`);
  };

  const toggleReview = (review: Review) => {
    const reviewId = `${review.date}-${review.id}`;
    setCompletedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const addReview = (review: Review) => {
    setReviews(prev => [...prev, review]);
  };

  const getDailyReviews = (date: Date) => {
    const dateStr = formatDate(date);
    return reviews.filter(review => review.date === dateStr);
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