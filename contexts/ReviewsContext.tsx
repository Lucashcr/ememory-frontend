import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import api from '../services/api';
import { formatDateString, getCurrentDate } from '../services/dateUtils';
import { Subject } from './SubjectsContext';

export type ReviewDate = {
  scheduled_for: string;
  status: 'pending' | 'completed' | 'skipped';
};

export type Review = {
  id: string;
  topic: string;
  subject: Subject;
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
  deleteReview: (id: string) => Promise<void>;
  setReviews: (reviews: Review[]) => void;
  getDailyReviews: (date: string) => Review[];
  formatDate: (date: string | Date) => string;
  isLoadingReviews: boolean;
  fetchReviews: () => Promise<void>;
};

export const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [completedReviews, setCompletedReviews] = useState<string[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoadingReviews(true);
      const response = await api.get('/reviews/');
      
      const reviewsData = Array.isArray(response.data) ? response.data : [];
      setReviews(reviewsData);
      
      const today = getCurrentDate();
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
      setIsLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const isReviewCompleted = (review: Review) => {
    const today = getCurrentDate();
    return review.review_dates.some(date => 
      date.scheduled_for === today && date.status === 'completed'
    );
  };

  const isReviewSkipped = (review: Review) => {
    const today = getCurrentDate();
    return review.review_dates.some(date => 
      date.scheduled_for === today && date.status === 'skipped'
    );
  };

  const toggleReview = async (review: Review) => {
    const reviewId = review.id;
    const currentDate = getCurrentDate();
    
    try {
      const currentStatus = review.review_dates.find(
        date => date.scheduled_for === currentDate
      )?.status;

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

  const deleteReview = async (id: string) => {
    try {
      await api.delete(`/reviews/${id}/`);
      setReviews(prev => prev.filter(review => review.id !== id));
      setCompletedReviews(prev => prev.filter(reviewId => reviewId !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };

  const getDailyReviews = (date: string) => {
    return reviews.filter(review =>
      review.review_dates.some(
        reviewDate => reviewDate.scheduled_for === date
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
    deleteReview,
    setReviews,
    getDailyReviews,
    formatDate: formatDateString,
    isLoadingReviews,
    fetchReviews,
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