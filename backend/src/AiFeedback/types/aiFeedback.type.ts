export type AiFeedback = {
  explanation: string;
  pointsDeducted: number;
  category: string;
};

export type AiFeedbackList = {
  errors: AiFeedback[];
};
