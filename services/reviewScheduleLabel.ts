import { Review } from '@/contexts/ReviewsContext';

const reviewScheduleLabelMap: Record<number, string> = {
  0: 'Inicial',
  1: '1 dia',
  2: '7 dias',
  3: '15 dias',
  4: '30 dias',
  5: '60 dias',
};

const getReviewScheduleLabel = (review: Review, date: string) => {
  const reviewIndex = review.review_dates.findIndex(
    (rd) => rd.scheduled_for === date
  );
  return reviewScheduleLabelMap[reviewIndex] || '';
};

export default getReviewScheduleLabel;
