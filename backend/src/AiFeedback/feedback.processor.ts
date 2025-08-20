import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { AI_FEEDBACK_SERVICE_TOKEN } from 'src/AiFeedback/abstract-services/abstract-aiFeedback.service';
import { AiFeedbackService } from 'src/AiFeedback/aiFeedback.service';
import { GenerateAiFeedbackType } from 'src/AiFeedback/types/aiFeedback.generate.type';
import { AiFeedback } from 'src/AiFeedback/types/aiFeedback.type';
import { QUESTION_SERVICE_TOKEN } from 'src/Question/abstract-services/abstract-question.service';
import { QuestionService } from 'src/Question/question.service';
import { SUBMISSION_SERVICE_TOKEN } from 'src/Submission/abstract-services/abstract-submission.service';
import { SubmissionService } from 'src/Submission/submission.service';

@Processor('feedback')
export class FeedbackProcessor {
  constructor(
    @Inject(AI_FEEDBACK_SERVICE_TOKEN)
    private readonly aiFeedbackService: AiFeedbackService,
    @Inject(SUBMISSION_SERVICE_TOKEN)
    private readonly submissionService: SubmissionService,
    @Inject(QUESTION_SERVICE_TOKEN)
    private readonly questionService: QuestionService,
  ) {}
  @Process('generate-feedback')
  async process(
    job: Job<{
      submissionId: string;
      questionId: number;
      studentAnswer: string;
    }>,
  ): Promise<any> {
    const { submissionId, questionId, studentAnswer } = job.data;

    try {
      // console.log(`Processing feedback for submission: ${submissionId}`);
      const { prompt_text, marathon_id } =
        await this.questionService.findOne(questionId);

      // Prepare data for AI feedback generation
      const data: GenerateAiFeedbackType = {
        question: prompt_text,
        studentAnswer: studentAnswer,
      };

      // Generate AI feedback and wait for the result
      const { corrected_answer, errors, final_score } =
        await this.aiFeedbackService.generateFeedback(data);

      const formattedErrors: AiFeedback[] = errors.map((error) => ({
        explanation: error.explanation,
        pointsDeducted: error.points_deducted,
        category: error.category,
      }));

      // Save feedback and update submission in parallel
      await Promise.all([
        this.aiFeedbackService.saveFeedback(
          formattedErrors,
          submissionId,
          marathon_id,
        ),
        this.submissionService.update(
          { correctedAnswer: corrected_answer, score: final_score },
          submissionId,
        ),
      ]);

      // console.log(
      //   `Successfully processed feedback for submission: ${submissionId}`,
      // );
    } catch (error) {
      console.error(`Failed to process job ${job.id}`, error);
      throw error; // Re-throw error to let Bull handle job retries
    }
  }
}
