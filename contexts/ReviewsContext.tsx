import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useReviewsService } from '@/hooks/useReviewsService';
import { formatDateString } from '@/services/dateUtils';
import { Review, CreateReviewDTO, UpdateReviewDTO } from '@/services/reviews/types';

interface ReviewsContextType {
  reviews: Review[];
  completedReviews: string[];
  isReviewCompleted: (review: Review) => boolean;
  isReviewSkipped: (review: Review) => boolean;
  toggleReview: (review: Review) => Promise<void>;
  addReview: (review: CreateReviewDTO) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  setReviews: (reviews: Review[]) => void;
  getDailyReviews: (date: string) => Review[];
  formatDate: (date: string | Date) => string;
  isLoadingReviews: boolean;
  fetchReviews: () => Promise<void>;
  updateReview: (reviewId: string, data: UpdateReviewDTO) => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const reviewsService = useReviewsService();

  useEffect(() => {
    reviewsService.fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReviewsContext.Provider value={{
      ...reviewsService,
      formatDate: formatDateString
    }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}

export type { Review, ReviewDate } from '@/services/reviews/types';
