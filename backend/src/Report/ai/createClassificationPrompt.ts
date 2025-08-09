const ERROR_CATEGORIES = [
  'Grammar',
  'Mechanics',
  'Sentence Structure & Syntax',
  'Word Choice & Style',
];

export const createClassificationPrompt = (explanation: string) => {
  const categoriesString = JSON.stringify(ERROR_CATEGORIES);
  return `Your task is to classify a single language error explanation into one of the following predefined categories. Respond with ONLY the category name and nothing else.
  Categories: ${categoriesString}
  Error Explanation: "${explanation}"
  Category:`;
};
