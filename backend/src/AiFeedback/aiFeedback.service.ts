import { GoogleGenAI } from '@google/genai';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AbstractAiFeedbackService } from 'src/AiFeedback/abstract-services/abstract-aiFeedback.service';
import { GenerateAiFeedbackDto } from 'src/AiFeedback/dto/aiFeedback.generate.dto';
import { SaveAiFeedbackDto } from 'src/AiFeedback/dto/aiFeedback.save.dto';
import { AiFeedBack } from 'src/AiFeedback/entities/aiFeedback.entity';
import {
  CorrectionReport,
  RawAiCorrection,
} from 'src/AiFeedback/interfaces/correctionResponse';
import { createCorrectionPromptJsonOutput } from 'src/AiFeedback/prompts/correct-questions';
import { AbstractAiFeedbackRepository } from 'src/repositories/abstract/aiFeedback.repository';

@Injectable()
export class AiFeedbackService implements AbstractAiFeedbackService {
  constructor(
    private readonly aiFeedbackRepository: AbstractAiFeedbackRepository,
    @Inject()
    private readonly gemini: GoogleGenAI,
  ) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not found.');
    }
    this.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  async findAllBySubmissionId(id: string): Promise<AiFeedBack[]> {
    return await this.aiFeedbackRepository.findAllBySubmissionId(id);
  }

  async saveFeedback(
    dto: SaveAiFeedbackDto[],
    submissionId: string,
  ): Promise<void> {
    return await this.aiFeedbackRepository.saveFeedbacks(dto, submissionId);
  }

  async generateFeedback(
    dto: GenerateAiFeedbackDto,
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
}
