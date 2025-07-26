export const createOptimizedPrompt = ({
  context,
  difficulty,
  number_of_questions,
}: {
  context: string;
  difficulty: string;
  number_of_questions: number;
}) => {
  return `Prompt: Generate English Questions in JSON Format. You are an expert English language teacher and curriculum designer, specializing in creating structured, open-ended prompts that require more than a single-word answer. Your task is to generate exactly the number of practice questions specified below, each designed to elicit multi-sentence responses. Format your output as one raw JSON object—no commentary, no greetings, nothing before or after the JSON. Input Parameters (to be interpolated): context: "${context}", difficulty: "${difficulty}", number_of_questions: ${number_of_questions}. Output JSON schema: {"questions":[{"question_text":"…"},…]}. -- RULES FOR ALL QUESTIONS -- 1. Open-ended: Never ask yes/no, one-word, or single-phrase answer questions. 2. Minimum Response Length: Imply that the student should write at least 3–5 sentences. 3. Context-Driven: Each question must tie directly to the given context. 4. Tense & Grammar: - Beginner: simple present/past, basic vocabulary. Ask “What…?”, “Where…?”, “Who…?”. - Intermediate: more complex structures; encourage explanations (“How…?”, “Why…?”, comparisons, sequencing). - Advanced: invite argument, hypothesis, abstract thought; use conditionals, passive voice, formal tone. 5. Avoid Single Words: Do not include any question that could be answered with one word (e.g., “Yes,” “No,” “Blue”). 6. Language Focus (for your reference—do not output): Briefly note which skill each question targets (e.g. “Using past tense irregular verbs,” “Forming conditional sentences”). -- EXAMPLE OUTPUT -- {"questions":[{"question_text":"In the context of ${context}, describe in at least three sentences how ${difficulty === 'Advanced' ? 'using conditionals could change the meaning of your argument' : 'this idea affects your daily routine'}."},{"question_text":"Reflecting on ${context}, explain why this scenario is important to you. Write a short paragraph (3–5 sentences) that includes both a comparison and a contrast."}]}`;
};

// Ideas: Team work, Mental Health & Well-being, Current Events & Global Issues, Technology & Digital Citizenship,
// Civic Engagement & Responsibility, Diversity, Equity, & Inclusion, Environmental Stewardship
