import { Subject } from '../subjects/types';

export type ReviewStatus = 'pending' | 'completed' | 'skipped';

export interface ReviewDate {
  scheduled_for: string;
  status: ReviewStatus;
}

export interface Review {
  id: string;
  topic: string;
  subject: Subject;
  notes: string;
  review_dates: ReviewDate[];
}

export interface CreateReviewDTO {
  topic: string;
  subject_id: string;
  notes: string;
  initial_date: string;
  mark_first?: boolean;
}

export interface UpdateReviewDTO {
  topic?: string;
  subject_id?: string;
  notes?: string;
  initial_date?: string;
  mark_first?: boolean;
}

export interface UpdateReviewStatusDTO {
  date: string;
  status: ReviewStatus;
}

export interface IReviewsService {
  fetchReviews(): Promise<Review[]>;
  addReview(data: CreateReviewDTO): Promise<void>;
  deleteReview(id: string): Promise<void>;
  updateReview(id: string, data: UpdateReviewDTO): Promise<void>;
  updateReviewStatus(id: string, data: UpdateReviewStatusDTO): Promise<void>;
}
