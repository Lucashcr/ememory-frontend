import api from '../api';
import { CreateReviewDTO, IReviewsService, Review, UpdateReviewDTO, UpdateReviewStatusDTO } from './types';

export class ReviewsServiceImpl implements IReviewsService {
  private readonly api;

  constructor(api: typeof import('../api').default) {
    this.api = api;
  }

  async fetchReviews(): Promise<Review[]> {
    const response = await this.api.get('/reviews/');
    return Array.isArray(response.data) ? response.data : [];
  }

  async addReview(data: CreateReviewDTO): Promise<void> {
    await this.api.post('/reviews/', data);
  }

  async deleteReview(id: string): Promise<void> {
    await this.api.delete(`/reviews/${id}/`);
  }

  async updateReview(id: string, data: UpdateReviewDTO): Promise<void> {
    await this.api.patch(`/reviews/${id}/`, data);
  }

  async updateReviewStatus(id: string, data: UpdateReviewStatusDTO): Promise<void> {
    await this.api.patch(`/reviews/${id}/status/`, data);
  }
}

export const reviewsService = new ReviewsServiceImpl(api);
