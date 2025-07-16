import { api, ApiClientType } from '../api';
import { CreateSubjectDTO, ISubjectsService, Subject, UpdateSubjectDTO } from './types';

export class SubjectsServiceImpl implements ISubjectsService {
  private readonly api: ApiClientType;

  constructor(apiClient: ApiClientType = api) {
    this.api = apiClient;
  }

  async fetchSubjects(): Promise<Subject[]> {
    return this.api.get<Subject[]>('/reviews/subjects/');
  }

  async addSubject(data: CreateSubjectDTO): Promise<Subject> {
    return this.api.post<Subject>('/reviews/subjects/', data);
  }

  async removeSubject(id: string): Promise<void> {
    return this.api.delete<void>(`/reviews/subjects/${id}/`);
  }

  async updateSubject({ id, ...data }: UpdateSubjectDTO): Promise<Subject> {
    return this.api.put<Subject>(`/reviews/subjects/${id}/`, data);
  }
}

export const subjectsService = new SubjectsServiceImpl(api);
