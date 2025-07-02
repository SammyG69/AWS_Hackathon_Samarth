import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Prepared prompt with a placeholder for the transcript
const basePrompt = transcript => `
The negative emotion is given to you. Based on the negative emotion, provide words of solace
that will be appropriate for the situation and offer encouragement if the transcript is very negative.
Keep it UNDER 25 WORDS at maximum and aim for 20-30, unless the situation demands it.

MAKE THE COMFORT WORDS RELEVANT TO THE SITUATION WHERE POSSIBLE.
${transcript}
`;

export async function getGroqChatCompletion(content) {
  return groq.chat.completions.create({
    messages: [{ role: 'user', content }],
    model: 'llama-3.1-8b-instant',
  });
}

export async function comforter(transcriptText) {
  try {
    const formattedPrompt = basePrompt(transcriptText);
    const chatCompletion = await getGroqChatCompletion(formattedPrompt);
    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('An error occurred while fetching the chat completion:', error);
    throw error;
  }
}
