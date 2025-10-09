import { Injectable } from '@nestjs/common';
import { Report } from '@prisma/client';
import { AbstractReportService } from 'src/Report/abstract-services/abstract-report.service';
import { ReportGateway } from 'src/Report/gateway/report.gateway';

// Helper to simulate the processing delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class MockReportService implements AbstractReportService {
  private reportGateway: ReportGateway;
  private times = 0;
  // The mock service doesn't need other dependencies, just the gateway to emit progress
  constructor() {}

  setReportGateway(gateway: ReportGateway) {
    this.reportGateway = gateway;
  }

  /**
   * Simulates fetching a report, returning the same mocked data.
   */
  async findByMarathonId(marathonId: string): Promise<Report> {
    console.log(`[MOCK] Fetching report for marathon: ${marathonId}`);
    // For a more complete mock, you could add logic to
    // return 'null' or throw an error if the ID is not the expected one.

    // Returns the mocked data instead of null
    return this.getMockedReportData(marathonId) as Report;
    // return null;
  }

  /**
   * Simulates the entire report creation process, emitting progress
   * events and returning a static JSON at the end.
   */
  async createReport(marathonId: string): Promise<Report> {
    console.log(`[MOCK] Starting report creation for marathon: ${marathonId}`);

    // Step 1 GET FEEDBACKS
    this._emitProgress(
      marathonId,
      10,
      'Fetching class data and feedbacks (mock)...',
    );
    await delay(2000);

    // Step 2: IA
    this._emitProgress(marathonId, 30, 'Generating analysis with AI (mock)...');
    await delay(4000);

    // Step 3 SAVING
    this._emitProgress(
      marathonId,
      90,
      'Saving report to the database (mock)...',
    );
    await delay(3000);

    // Step 4
    this._emitProgress(marathonId, 100, 'Report completed!');
    console.log(`[MOCK] Report for marathon ${marathonId} completed.`);

    // Returns the static JSON object
    // The 'as unknown as Report' is used to bypass strict type checking,
    // since our mocked object might not have all the exact fields of the Prisma type.
    return this.getMockedReportData(marathonId) as Report;
  }

  // Helper to emit Progress (same as the original)
  private _emitProgress(
    marathonId: string,
    progress: number,
    message?: string,
  ) {
    if (this.reportGateway) {
      this.reportGateway.emitReportProgress(marathonId, progress, message);
    }
  }

  private getMockedReportData(marathonId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ERROR_CATEGORIES = [
      'Verb Tense and Form',
      'Subject-Verb Agreement',
      'Pronouns',
      'Articles/Prepositions/Modifiers',
      'Punctuation',
      'Capitalization',
      'Spelling',
      'Sentence Fluency & Clarity',
      'Word Choice',
    ];

    const mockReports = [
      {
        id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
        classroom_name: 'Turma de Teste (Mock)',
        marathon_id: 'marathon-001',
        total_errors: 5 + 11 + 3 + 20 + 13 + 9 + 8 + 1 + 21,
        created_at: new Date('2025-10-08T12:39:16.945Z'),

        report_details: [
          {
            id: 1,
            report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
            occurrences: 31,
            category_name: 'Verb Tense and Form',
            examples: `["The team finish the project yesterday should be The team finished the project yesterday to reflect the past action"]`,
            targeted_advice:
              'Ensure verbs are in the correct tense. For actions completed in the past, use the simple past tense (e.g., -ed).',
          },
          {
            id: 2,
            report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
            occurrences: 11,
            category_name: 'Subject-Verb Agreement',
            examples: `["The list of requirements are long should be The list of requirements is long because the subject is list singular"]`,
            targeted_advice:
              'Make sure the verb agrees with the subject, not the nearest noun. Identify the true subject of the sentence to choose the correct verb form.',
          },
          {
            id: 4,
            report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
            occurrences: 3,
            category_name: 'Pronouns',
            examples: `["Me and my colleague will attend should be My colleague and I will attend - Use I for the subject case"]`,
            targeted_advice:
              'Use the correct pronoun case. "I", "she", "he" are for subjects, while "me", "her", "him" are for objects. To test, remove the other person from the sentence.',
          },
          {
            id: 6,
            report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
            occurrences: 20,
            category_name: 'Articles/Prepositions/Modifiers',
            examples: `["The user needs a URL should be The user needs an URL because URL starts with a vowel sound"]`,
            targeted_advice:
              "Use 'an' before words that start with a vowel sound (a, e, i, o, u), and 'a' before words that start with a consonant sound.",
          },
          {
            id: 9,
            report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
            occurrences: 13,
            category_name: 'Punctuation',
            examples: `["The process is complete however we need to verify the results is a comma splice - Use a semicolon instead"]`,
            targeted_advice:
              'Do not link two independent clauses with only a comma. Use a period, a semicolon, or a comma with a coordinating conjunction (for, and, nor, but, or, yet, so).',
          },
          {
            id: 11,
            report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
            occurrences: 9,
            category_name: 'Capitalization',
            examples: `["Our next meeting is on friday should be Our next meeting is on Friday as days of the week are proper nouns"]`,
            targeted_advice:
              'Always capitalize the first word of a sentence, proper nouns (names, places, days, months), and major words in titles.',
          },
          {
            id: 12,
            report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
            occurrences: 8,
            category_name: 'Spelling',
            examples: `["This is a great oportunity is misspelled - The correct spelling is opportunity"]`,
            targeted_advice:
              'Double-check the spelling of commonly misspelled words. Using a spell checker is helpful, but proofreading is essential for catching context errors.',
          },
          {
            id: 15,
            report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
            occurrences: 1,
            category_name: 'Sentence Fluency & Clarity',
            examples: `["The reason is due to the fact that the API was offline is wordy - Simplify to The reason is that the API was offline"]`,
            targeted_advice:
              'Avoid redundant phrases and wordiness. Aim for concise language to make your writing clearer and more impactful.',
          },

          {
            id: 17,
            report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
            occurrences: 21,
            category_name: 'Word Choice',
            examples: `["We need to fix the bug is informal - Use a more professional term like resolve or address or rectify"]`,
            targeted_advice:
              'In professional and technical writing, choose precise and formal vocabulary over informal or generic words.',
          },
        ],
      },
      {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        classroom_name: 'Turma Avançada de Inglês (Mock)',
        marathon_id: 'marathon-002',
        total_errors: 3,
        created_at: new Date('2025-10-09T09:15:00.000Z'),
        report_details: [
          {
            id: 6,
            report_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            occurrences: 2,
            category_name: 'Style',
            examples: `["Style: The sentence uses passive voice: \\"The report was written by me.\\" Active voice is more direct: \\"I wrote the report.\\"","Style: Another example of passive voice was found: \\"The decision was made by the team.\\""]`,
            targeted_advice:
              'To improve your style, favor active voice over passive voice. Active voice makes your writing more direct, concise, and engaging. Use passive voice intentionally, for example, when the action is more important than the actor.',
          },
          {
            id: 7,
            report_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            occurrences: 1,
            category_name: 'Vocabulary',
            examples: `["Vocabulary: The verb \\"get\\" is often overused. Instead of \\"we need to get more results,\\" consider \\"we need to achieve more results\\" or \\"obtain more results.\\""]`,
            targeted_advice:
              'Enhance your vocabulary by replacing common, general-purpose verbs (like "get", "do", "make") with more specific and powerful verbs. This will make your communication more precise and professional.',
          },
          {
            id: 8,
            report_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            occurrences: 1,
            category_name: 'Grammar',
            examples: `["Grammar: Subject-verb agreement error. \\"The list of items are on the desk.\\" should be \\"The list of items is on the desk.\\" The subject is 'list', which is singular."]`,
            targeted_advice:
              'Pay close attention to subject-verb agreement. Always ensure the verb matches its true subject, not just the nearest noun, especially in sentences with prepositional phrases.',
          },
        ],
      },
      {
        id: '2d8b9e7b-4a6f-4c91-8d2a-5c5e0f7e3d1c',
        classroom_name: 'Iniciantes - Redação Corporativa (Mock)',
        marathon_id: 'marathon-003',
        total_errors: 4,
        created_at: new Date('2025-09-25T18:00:00.000Z'),
        report_details: [
          {
            id: 9,
            report_id: '2d8b9e7b-4a6f-4c91-8d2a-5c5e0f7e3d1c',
            occurrences: 1,
            category_name: 'Punctuation',
            examples: `["Punctuation: Incorrect use of an apostrophe in \\"its\\". Remember, \\"it's\\" is a contraction for \\"it is\\", while \\"its\\" is possessive."]`,
            targeted_advice:
              'To improve your punctuation, review the rules for common confusables like "it\'s" vs. "its" and "your" vs. "you\'re". Mastering these small details significantly boosts your credibility.',
          },
          {
            id: 10,
            report_id: '2d8b9e7b-4a6f-4c91-8d2a-5c5e0f7e3d1c',
            occurrences: 2,
            category_name: 'Clarity',
            examples: `["Clarity: The sentence is a run-on sentence. \\"I finished my work I went home.\\" should be separated into two sentences or joined with a conjunction: \\"I finished my work, and then I went home.\\""]`,
            targeted_advice:
              'To enhance clarity, avoid run-on sentences. Ensure that each sentence expresses a complete thought and is correctly separated from the next, using periods, semicolons, or coordinating conjunctions.',
          },
          {
            id: 11,
            report_id: '2d8b9e7b-4a6f-4c91-8d2a-5c5e0f7e3d1c',
            occurrences: 1,
            category_name: 'Tone',
            examples: `["Tone: The phrase \\"You must complete this by Friday\\" can sound demanding. A more collaborative tone would be: \\"Could we aim to have this completed by Friday?\\""]`,
            targeted_advice:
              'Adjust your tone for professional communication. Use polite and collaborative language instead of direct commands to foster better teamwork and a more positive work environment.',
          },
          {
            id: 12,
            report_id: '2d8b9e7b-4a6f-4c91-8d2a-5c5e0f7e3d1c',
            occurrences: 1,
            category_name: 'Cohesion',
            examples: `["Cohesion: The pronoun \\"they\\" is used ambiguously. In \\"The managers told the employees that they would get a bonus,\\" it's unclear who 'they' refers to. Rephrase for clarity: \\"The managers announced that the employees would get a bonus.\\""]`,
            targeted_advice:
              'To improve cohesion, ensure that all pronouns (he, she, it, they) clearly refer to a specific noun. Ambiguous pronouns can confuse the reader and obscure your message.',
          },
        ],
      },
    ];

    const report = mockReports.find((r) => r.marathon_id === marathonId);
    return report || mockReports[0];
  }
  // Centraliza a geração do JSON mockado
  // private getMockedReportData(marathonId: string) {
  //   return {
  //     id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
  //     classroom_name: 'Turma de Teste (Mock)',
  //     marathon_id: marathonId, // Usa o ID recebido para consistência
  //     total_errors: 5,
  //     created_at: new Date('2025-10-08T12:39:16.945Z'), // Convertido para objeto Date
  //     report_details: [
  //       {
  //         id: 1,
  //         report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
  //         occurrences: 1,
  //         category_name: 'Grammar',
  //         examples: `["Grammar: The sentence \\"My role was checking the logs\\" could be improved for formality. Consider \\"My role was to check the logs.\\""]`,
  //         targeted_advice:
  //           'To improve your grammar, focus on distinguishing when to use infinitives (to + verb) versus gerunds (-ing) to describe roles or purposes, often favoring infinitives for formality and precision.',
  //       },
  //       {
  //         id: 2,
  //         report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
  //         occurrences: 1,
  //         category_name: 'Punctuation',
  //         examples: `["Punctuation: A comma is needed before \\"Without\\" in the second sentence for better flow."]`,
  //         targeted_advice:
  //           'To improve your punctuation, focus on using commas to separate introductory phrases or clauses that precede the main sentence, as this significantly enhances readability and flow.',
  //       },
  //       {
  //         id: 3,
  //         report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
  //         occurrences: 1,
  //         category_name: 'Vocabulary',
  //         examples: `["Vocabulary: \\"Have regular meetings\\" could be more formal. Consider \\"conduct regular meetings.\\""]`,
  //         targeted_advice:
  //           'To improve your vocabulary, focus on selecting more formal and precise verbs and nouns, especially for professional or academic contexts. Practice by identifying informal terms and finding their more appropriate formal equivalents.',
  //       },
  //       {
  //         id: 4,
  //         report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
  //         occurrences: 1,
  //         category_name: 'Clarity',
  //         examples: `["Clarity: \\"Done more mock runs\\" is a bit informal. Consider \\"conducted more practice sessions.\\""]`,
  //         targeted_advice:
  //           'To enhance clarity, replace informal or vague verbs and nouns with more precise and professional alternatives that clearly communicate your intended meaning.',
  //       },
  //       {
  //         id: 5,
  //         report_id: '93a27753-743a-43d9-bdf1-ab2e3b8484e6',
  //         occurrences: 1,
  //         category_name: 'Cohesion',
  //         examples: `["Cohesion: The connection between the two sentences could be stronger. Consider using a transition word like \\"For example,\\" or \\"Indeed,\\\"."]`,
  //         targeted_advice:
  //           "To improve cohesion, consciously use transition words and phrases (e.g., 'however,' 'therefore,' 'for example') to clearly link your sentences and ideas, ensuring a smooth logical flow for the reader.",
  //       },
  //     ],
  //   };
  // }
}
