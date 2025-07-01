import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Prepared prompt with a placeholder for the transcript
const basePrompt = transcript => `
Imagine yourself as a third party to this conversation. Identify the overarching problem or goal first AND DO NOT SAY ANYTHING ONCE YOU IDENTIFY AND DONT STATE THE OVERARCHING PROBLEM OR ANYTHING SYNONYMOUS
After identifying the goal or problem, highlight key concerns individuals are having. DO NOT SAY OR PRINT THIS

Make sure to contextualise the discussion. DO NOT PRINT THIS. 
Provide DETAILED, SPECIFIC, RELEVANT, NON-GENERIC, sugggestions on what can be done better by all the parties or
some ideas they may have missed that could make achievement of their goal much more better. 
Include DETAILED, SPECIFIC, RELEVANT, NON-GENERIC related suggestions based on the context and
not generalized ones. 
Provide examples where applicable, mention valid PROPER NOUNS (e.g apps, locations, games) and avoid vague sentences and generalistic advice. Provide
advice that is relatable and beneficial to the situation in hand.
Keep it CONCISE AND LIMITED TO 50 words MAX. ONLY RETURN SUGGESTIONS, NOT A SUMMARY, OR HIGHLIGHTS ABOUT THE SITUATION, OR ANYTHING IRRELEVANT.
WHERE necessary, provide links to resources (e.g articles, websites, papers etcc)

Be CLEAR, DIRECT and CONCISE

Transcript:
${transcript}
`;

export async function getGroqChatCompletion(content) {
  return groq.chat.completions.create({
    messages: [{ role: 'user', content }],
    model: 'llama-3.1-8b-instant',
  });
}

export async function main(transcriptText) {
  try {
    const formattedPrompt = basePrompt(transcriptText);
    const chatCompletion = await getGroqChatCompletion(formattedPrompt);
    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('An error occurred while fetching the chat completion:', error);
    throw error;
  }
}
