export class GenerateQuestionsDto {
  context: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  number_of_questions: number;
}
