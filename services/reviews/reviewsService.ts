import { api, ApiClientType } from '../api';
import { CreateReviewDTO, IReviewsService, Review, UpdateReviewDTO, UpdateReviewStatusDTO } from './types';

export class ReviewsServiceImpl implements IReviewsService {
  private readonly api: ApiClientType;

  constructor(apiClient: ApiClientType = api) {
    this.api = apiClient;
  }

  async fetchReviews(): Promise<Review[]> {
    return this.api.get<Review[]>('/reviews/');
  }

  async addReview(data: CreateReviewDTO): Promise<void> {
    await this.api.post<void>('/reviews/', data);
  }

  async deleteReview(id: string): Promise<void> {
    await this.api.delete<void>(`/reviews/${id}/`);
  }

  async updateReview(id: string, data: UpdateReviewDTO): Promise<void> {
    await this.api.patch<void>(`/reviews/${id}/`, data);
  }

  async updateReviewStatus(id: string, data: UpdateReviewStatusDTO): Promise<void> {
    await this.api.patch<void>(`/reviews/${id}/status/`, data);
  }
}

export const reviewsService = new ReviewsServiceImpl(api);
