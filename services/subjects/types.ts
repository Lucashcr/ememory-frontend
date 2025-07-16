export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface CreateSubjectDTO {
  name: string;
  color: string;
}

export interface UpdateSubjectDTO extends CreateSubjectDTO {
  id: string;
}

export interface ISubjectsService {
  fetchSubjects(): Promise<Subject[]>;
  addSubject(data: CreateSubjectDTO): Promise<Subject>;
  removeSubject(id: string): Promise<void>;
  updateSubject(data: UpdateSubjectDTO): Promise<Subject>;
}
