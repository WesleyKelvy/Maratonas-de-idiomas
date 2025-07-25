export interface GeminiResponse {
  questions: {
    question_text: string;
  }[];
}

export type QuestionArray = {
  question_text: string;
}[];
