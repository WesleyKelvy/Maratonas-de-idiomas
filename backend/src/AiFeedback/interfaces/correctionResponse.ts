export type Error = {
  explanation: string;
  points_deducted: number;
  category: string;
};

export type CorrectionReport = {
  corrected_answer: string;
  errors: Error[];
  final_score: number;
};

export type RawAiCorrection = {
  correction_report: CorrectionReport;
};
