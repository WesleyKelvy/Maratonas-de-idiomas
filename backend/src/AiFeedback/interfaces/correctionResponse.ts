export interface Error {
  explanation: string;
  points_deducted: number;
}

export interface CorrectionReport {
  corrected_answer: string;
  errors: Error[];
  final_score: number;
}

export interface RawAiCorrection {
  correction_report: CorrectionReport;
}
