import 'dotenv/config';
import Groq from 'groq-sdk';

const negativeEmotions = new Array[
  ('SAD', 'ANGRY', 'BERATED', 'CRAZY', 'CONFUSION', 'STRESSED', 'SCARED', 'HESITANT', 'DISGUSTED')
]();

const positiveEmotions = new Array[
  ('NEUTRAL', 'HAPPY, CONFIDENT', 'FUNNY', 'CHEERY', 'CONSIDERATE')
]();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Prepared prompt with a placeholder for the transcript
const basePrompt = transcript => `
Classify the sentiment of the given transcript, into only ONE of the following emotions: NEUTRAL, HAPPY, CONFIDENT, FUNNY, CHEERY, CONSIDERATE,
SAD, ANGRY, BERATED, CRAZY, CONFUSION, STRESSED, SCARED, HESITANT, DISGUSTED.

Do not return anything else but one word from the given list of emotions in CAPITAL LETTERS
Transcript:
${transcript}
`;

export async function getGroqChatCompletion(content) {
  return groq.chat.completions.create({
    messages: [{ role: 'user', content }],
    model: 'llama-3.1-8b-instant',
  });
}

export async function sentianalyzer(transcriptText) {
  try {
    const formattedPrompt = basePrompt(transcriptText);
    const chatCompletion = await getGroqChatCompletion(formattedPrompt);
    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('An error occurred while fetching the chat completion:', error);
    throw error;
  }
}
