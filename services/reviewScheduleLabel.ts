import { Review } from '@/contexts/ReviewsContext';

const reviewScheduleLabelMap: Record<number, string> = {
  0: 'Estudo Inicial',
  1: 'Revisão (1 dia)',
  2: 'Revisão (1 semana)',
  3: 'Revisão (2 semanas)',
  4: 'Revisão (1 mês)',
  5: 'Revisão (2 meses)',
};

const getReviewScheduleLabel = (review: Review, date: string) => {
  const reviewIndex = review.review_dates.findIndex(
    (rd) => rd.scheduled_for === date
  );
  return reviewScheduleLabelMap[reviewIndex] || '';
};

export default getReviewScheduleLabel;
