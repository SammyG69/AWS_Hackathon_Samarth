import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Prepared prompt with a placeholder for the transcript
const basePrompt = transcript => `
You are an expert sentiment classifier.

Classify the **overall emotional tone** of the following text into ONE of the following categories **only**:

💬 POSITIVE: NEUTRAL, HAPPY, CONFIDENT, FUNNY, CHEERY, CONSIDERATE  
💬 NEGATIVE: SAD, ANGRY, BERATED, CRAZY, CONFUSION, STRESSED, SCARED, HESITANT, DISGUSTED, FRUSTRATED, ANNOYED

Give ONLY one word from the above list — in CAPITAL LETTERS — with NO explanation.

Examples:
1. "I'm fine" → NEUTRAL  
2. "I'm so angry right now" → ANGRY  
3. "This is amazing!" → HAPPY  
4. "Everything’s going wrong, I can’t take it" → STRESSED  

Now classify:
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
