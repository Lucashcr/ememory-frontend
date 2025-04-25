import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import api from '../services/api';

// Move formatDate outside component to avoid dependency cycle
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0'); // Corrigindo timezone removendo UTCDate
  return `${year}-${month}-${day}`;
};

export type ReviewDate = {
  scheduled_for: string;
  status: 'pending' | 'completed' | 'skipped';
};

export type Review = {
  id: string;
  topic: string;
  subject: {
    name: string;
    color: string;
  };
  notes: string;
  review_dates: ReviewDate[];
};

export type NewReview = {
  topic: string;
  subject_id: string;
  notes: string;
  initial_date: string;
};

type ReviewsContextType = {
  reviews: Review[];
  completedReviews: string[];
  isReviewCompleted: (review: Review) => boolean;
  isReviewSkipped: (review: Review) => boolean;
  toggleReview: (review: Review) => Promise<void>;
  addReview: (review: NewReview) => Promise<void>;
  getDailyReviews: (date: Date) => Review[];
  formatDate: (date: Date) => string;
  isLoading: boolean;
};

export const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [completedReviews, setCompletedReviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await api.get('/reviews/');
      
      // Garante que os dados são um array
      const reviewsData = Array.isArray(response.data) ? response.data : [];
      setReviews(reviewsData);
      
      const today = formatDate(new Date());
      const completed = reviewsData
        .filter((review: Review) => 
          review.review_dates.some(date => 
            date.scheduled_for === today && date.status === 'completed'
          ))
        .map((review: Review) => review.id);
      
      setCompletedReviews(completed);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const isReviewCompleted = (review: Review) => {
    const today = formatDate(new Date());
    return review.review_dates.some(date => 
      date.scheduled_for === today && date.status === 'completed'
    );
  };

  const isReviewSkipped = (review: Review) => {
    const today = formatDate(new Date());
    return review.review_dates.some(date => 
      date.scheduled_for === today && date.status === 'skipped'
    );
  };

  const toggleReview = async (review: Review) => {
    const reviewId = review.id;
    const currentDate = formatDate(new Date());
    
    try {
      const currentStatus = review.review_dates.find(
        date => date.scheduled_for === currentDate
      )?.status;

      // Define o próximo status baseado no status atual
      let newStatus: 'pending' | 'completed' | 'skipped';
      if (currentStatus === 'completed') {
        newStatus = 'pending';
      } else if (currentStatus === 'skipped') {
        newStatus = 'pending';
      } else {
        newStatus = 'completed';
      }
      
      await api.patch(`/reviews/${reviewId}/status/`, {
        date: currentDate,
        status: newStatus
      });

      setCompletedReviews(prev =>
        newStatus === 'completed'
          ? [...prev, reviewId]
          : prev.filter(id => id !== reviewId)
      );

      // Update local review data
      setReviews(prev => prev.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            review_dates: r.review_dates.map(date => 
              date.scheduled_for === currentDate 
                ? { ...date, status: newStatus }
                : date
            )
          };
        }
        return r;
      }));
    } catch (error) {
      console.error('Error toggling review status:', error);
    }
  };

  const addReview = async (review: NewReview) => {
    try {
      const response = await api.post('/reviews/', review);
      setReviews(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const getDailyReviews = (date: Date) => {
    const dateStr = formatDate(date);
    return reviews.filter(review =>
      review.review_dates.some(
        reviewDate => reviewDate.scheduled_for === dateStr
      )
    );
  };

  const value = {
    reviews,
    completedReviews,
    isReviewCompleted,
    isReviewSkipped,
    toggleReview,
    addReview,
    getDailyReviews,
    formatDate,
    isLoading,
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