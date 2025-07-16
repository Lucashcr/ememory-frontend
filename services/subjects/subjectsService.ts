import api from '../api';
import { CreateSubjectDTO, ISubjectsService, Subject, UpdateSubjectDTO } from './types';

export class SubjectsServiceImpl implements ISubjectsService {
  private readonly api;

  constructor(api: typeof import('../api').default) {
    this.api = api;
  }

  async fetchSubjects(): Promise<Subject[]> {
    const response = await this.api.get('/reviews/subjects/');
    return response.data;
  }

  async addSubject(data: CreateSubjectDTO): Promise<Subject> {
    const response = await this.api.post('/reviews/subjects/', data);
    return response.data;
  }

  async removeSubject(id: string): Promise<void> {
    await this.api.delete(`/reviews/subjects/${id}/`);
  }

  async updateSubject({ id, ...data }: UpdateSubjectDTO): Promise<Subject> {
    const response = await this.api.put(`/reviews/subjects/${id}/`, data);
    return response.data;
  }
}

export const subjectsService = new SubjectsServiceImpl(api);
