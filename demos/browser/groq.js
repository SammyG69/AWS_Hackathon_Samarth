import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Prepared prompt with a placeholder for the transcript
const basePrompt = ({ text, label, labelTranscript }) => `
Format" **${label}**

Labelled Segment:
"${labelTranscript}"

Full Transcript:
${text}

The Format states whether the labelled segment is a Question, Proposal or Confusion.

ALL ANSWERS NEED TO BE OF MAXIMUM AND UNDER 60 WORDS. USE EMOJIS to make the suggestions more appealing.

If the Format is a QUESTION. The Labelled Segment will have the question. Use the full transcript to gain contextual understanding
of what's being discussed but then answer the question DIRECTLY. BE SPECIFIC, NON-GENERIC, HIGHLY DETAILED,
while also keeping your response under 60 words. Provide links to resources (e.g articles, papers or sites etc) where relevant.

If the Format is a PROPOSAL, use the full transcript to understand the overarching goal or problem
of the conversation, and then evaluate the proposal which is in the Labelled Segment
, giving both pros and cons. BE SPECIFIC, DIRECT, AND CONCISE while under 60 words.
Provide links to resources (e.g articles, papers or sites etc) where relevant.

If the Format is a CONFUSION, use the full transcript to UNDERSTAND(not to be acted upon) the ovearching goal or problem and contextualise
the discussion. Once understood, please clarify the confusion which is expressed in the Labelled Segment nicely. AND KEEP UR RESPONSE UNDER 60 WORDS
Provide links to resources (e.g articles, papers or sites etc) where relevant.


`;

export async function getGroqChatCompletion(content) {
  return groq.chat.completions.create({
    messages: [{ role: 'user', content }],
    model: 'llama-3.1-8b-instant',
  });
}

export async function main({ text, label, labelTranscript }) {
  try {
    const formattedPrompt = basePrompt({ text, label, labelTranscript });
    const chatCompletion = await getGroqChatCompletion(formattedPrompt);
    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('An error occurred while fetching the chat completion:', error);
    throw error;
  }
}
