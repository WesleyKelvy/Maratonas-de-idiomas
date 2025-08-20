import { GoogleGenAI } from '@google/genai';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AiFeedbacks } from '@prisma/client';
import { AbstractAiFeedbackService } from 'src/AiFeedback/abstract-services/abstract-aiFeedback.service';
import { GenerateAiFeedbackType } from 'src/AiFeedback/types/aiFeedback.generate.type';
import {
  CorrectionReport,
  RawAiCorrection,
} from 'src/AiFeedback/interfaces/correctionResponse';
import { createCorrectionPromptJsonOutput } from 'src/AiFeedback/prompts/correct-questions';
import {
  AbstractAiFeedbackRepository,
  AI_FEEDBACK_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/aiFeedback.repository';
import { AiFeedback } from 'src/AiFeedback/types/aiFeedback.type';

@Injectable()
export class AiFeedbackService implements AbstractAiFeedbackService {
  constructor(
    @Inject(AI_FEEDBACK_REPOSITORY_TOKEN)
    private readonly aiFeedbackRepository: AbstractAiFeedbackRepository,
    @Inject()
    private readonly gemini: GoogleGenAI,
  ) {
    this.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  async findAllByMarathonId(id: string): Promise<AiFeedbacks[]> {
    return await this.aiFeedbackRepository.findAllByMarathonId(id);
  }

  async findAllBySubmissionId(id: string): Promise<AiFeedbacks[]> {
    return await this.aiFeedbackRepository.findAllBySubmissionId(id);
  }

  async saveFeedback(
    feedback: AiFeedback[],
    submissionId: string,
    marathonId: string,
  ): Promise<void> {
    return await this.aiFeedbackRepository.saveFeedbacks(
      feedback,
      submissionId,
      marathonId,
    );
  }

  async generateFeedback(
    dto: GenerateAiFeedbackType,
  ): Promise<CorrectionReport> {
    const promptTemplate = createCorrectionPromptJsonOutput(dto);

    try {
      const output = await this.gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptTemplate,
      });

      const response = output.text;

      // Clean the response to ensure it is valid JSON.
      // Gemini might sometimes include ```json ... ``` markers.
      const cleanedText = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      // parse into the wrapper
      const genResp: RawAiCorrection = JSON.parse(cleanedText);

      // pull out the array
      const corrections: CorrectionReport = genResp.correction_report;

      return corrections;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllByMaranhonId(id: string): Promise<AiFeedbacks[]> {
    return await this.aiFeedbackRepository.findAllByMarathonId(id);
  }
}
