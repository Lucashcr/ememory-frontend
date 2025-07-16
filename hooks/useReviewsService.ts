import { getCurrentDate } from '@/services/dateUtils';
import { reviewsService } from '@/services/reviews/reviewsService';
import { CreateReviewDTO, IReviewsService, Review, UpdateReviewDTO } from '@/services/reviews/types';
import { useCallback, useState } from 'react';
import { Toast } from 'toastify-react-native';

export function useReviewsService(service: IReviewsService = reviewsService) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [completedReviews, setCompletedReviews] = useState<string[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoadingReviews(true);
      const reviewsData = await service.fetchReviews();
      setReviews(reviewsData);
      
      const today = getCurrentDate();
      const completed = reviewsData
        .filter((review) => 
          review.review_dates.some(date => 
            date.scheduled_for === today && date.status === 'completed'
          ))
        .map((review) => review.id);
      
      setCompletedReviews(completed);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Toast.error('Erro ao carregar revisões');
    } finally {
      setIsLoadingReviews(false);
    }
  }, [service]);

  const isReviewCompleted = useCallback((review: Review) => {
    const today = getCurrentDate();
    return review.review_dates.some(date => 
      date.scheduled_for === today && date.status === 'completed'
    );
  }, []);

  const isReviewSkipped = useCallback((review: Review) => {
    const today = getCurrentDate();
    return review.review_dates.some(date => 
      date.scheduled_for === today && date.status === 'skipped'
    );
  }, []);

  const toggleReview = useCallback(async (review: Review) => {
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
      
      await service.updateReviewStatus(reviewId, {
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
      Toast.error('Erro ao atualizar status da revisão');
    }
  }, [service]);

  const addReview = useCallback(async (review: CreateReviewDTO) => {
    try {
      await service.addReview(review);
      await fetchReviews();
      Toast.success('Revisão criada com sucesso!');
    } catch (error) {
      console.error('Error adding review:', error);
      Toast.error('Erro ao criar revisão');
      throw error;
    }
  }, [service, fetchReviews]);

  const deleteReview = useCallback(async (id: string) => {
    try {
      await service.deleteReview(id);
      setReviews(prev => prev.filter(review => review.id !== id));
      setCompletedReviews(prev => prev.filter(reviewId => reviewId !== id));
      Toast.success('Revisão excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting review:', error);
      Toast.error('Erro ao excluir revisão');
      throw error;
    }
  }, [service]);

  const updateReview = useCallback(async (reviewId: string, data: UpdateReviewDTO) => {
    try {
      await service.updateReview(reviewId, data);
      await fetchReviews();
      Toast.success('Revisão atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating review:', error);
      Toast.error('Erro ao atualizar revisão');
      throw error;
    }
  }, [service, fetchReviews]);

  const getDailyReviews = useCallback((date: string) => {
    return reviews.filter(review =>
      review.review_dates.some(
        reviewDate => reviewDate.scheduled_for === date
      )
    );
  }, [reviews]);

  return {
    reviews,
    completedReviews,
    isReviewCompleted,
    isReviewSkipped,
    toggleReview,
    addReview,
    deleteReview,
    setReviews,
    getDailyReviews,
    isLoadingReviews,
    fetchReviews,
    updateReview
  };
}
