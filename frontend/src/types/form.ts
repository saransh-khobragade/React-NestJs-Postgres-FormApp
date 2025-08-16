export type QuestionType = 'text' | 'mcq';

export interface Question {
  id?: number;
  text: string;
  type: QuestionType;
  options?: string[];
}

export interface FormDto {
  id: number;
  title: string;
  createdAt: string;
  questions: Question[];
}

export interface CreateFormRequest {
  title: string;
  questions: Question[];
}

export interface SubmitResponseRequest {
  answers: Record<string, unknown>;
}

