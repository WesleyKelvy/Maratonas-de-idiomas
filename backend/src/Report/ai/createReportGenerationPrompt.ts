export const createReportGenerationPrompt = ({
  categoryName,
  occurrences,
  explanationSamples,
}) => {
  const examplesJson = JSON.stringify(explanationSamples);
  return `You are an expert language coach. A student has made ${occurrences} errors related to "${categoryName}".
  
  Here are up to 5 sample explanations for these errors:
  ${examplesJson}

  Based on these examples, write one single, actionable piece of targeted advice to help the student improve in the "${categoryName}" area. The advice should be concise and practical.

  Your output must be a raw JSON object with a single key "targeted_advice".
  
  Example Output:
  {
    "targeted_advice": "To improve your use of articles, review the rules for when to use 'a', 'an', and 'the' with countable and uncountable nouns. Practice with exercises focused specifically on article usage."
  }`;
};
