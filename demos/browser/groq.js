import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const questionPrompt = ({ text, labelTranscript }) => `
🔍 Format: **QUESTION**

📍 Labelled Segment (Question):
"${labelTranscript}"

📜 Full Transcript:
${text}

You're a helpful assistant answering a question based on the entire conversation. Keep it clear, direct, and non-generic. Use the full transcript for context, but answer ONLY the question. 
DO NOT STATE THE QUESTION AS IT WASTES THE WORDS
✅ Be concise (under 100 words), add emojis where fitting, and include useful links if relevant. PROVIDE A CLEAR, SHARP AND CONCISE ANSWER. 
`;

const proposalPrompt = ({ text, labelTranscript }) => `
📝 Format: **PROPOSAL**

💡 Proposed Idea:
"${labelTranscript}"

📜 Full Transcript:
${text}

You're evaluating a suggestion in context of the whole conversation. Clearly state both pros and cons, and suggest improvements or alternatives if necessary.
DO NOT STATE THE IDEA FULLY. JUST EVALUATE IT AND OFFER SUGGESTIONS.

If unable to for any reason, express that you need more information.

✅ Be direct, under 90 words, specific, include emojis and relevant links to back up points.
`;

const confusionPrompt = ({ text, labelTranscript }) => `
❓ Format: **CONFUSION**

🤔 Confused Statement:
"${labelTranscript}"

📜 Full Transcript:
${text}
Pretend you are a third party to this conversation and are there to provide suggestions.
You're clarifying a misunderstanding or solving a confusion. First, understand the goal of the discussion from the full transcript. DO NOT RETURN THIS OR MENTION THIS
. Then, kindly clarify the confusion expressed in the segment and offer CLEAR, DIRECT AND CONCISE SUGGESTIONS.JUST GIVE THE SUGGESTION, NO FLUFF.

If the inputs are invalid or some error occurs, gracefully express condolences and ask for more information. ELSE GIVE A CONCISE SUGGESTION

✅ Keep it polite, helpful, under 90 words. Use emojis and relevant resource links where applicable.
`;

const getPromptByLabel = ({ text, label, labelTranscript }) => {
  switch (label.toUpperCase()) {
    case 'QUESTION':
      return questionPrompt({ text, labelTranscript });
    case 'PROPOSAL':
      return proposalPrompt({ text, labelTranscript });
    case 'CONFUSION':
      return confusionPrompt({ text, labelTranscript });
  }
};

export async function getGroqChatCompletion(content) {
  return groq.chat.completions.create({
    messages: [{ role: 'user', content }],
    model: 'llama-3.1-8b-instant',
  });
}

export async function main({ text, label, labelTranscript }) {
  try {
    const prompt = getPromptByLabel({ text, label, labelTranscript });
    const chatCompletion = await getGroqChatCompletion(prompt);
    return chatCompletion.choices[0]?.message?.content?.replace(/\*\*/g, '')?.replace(/\\n/g, '\n');
  } catch (error) {
    console.error('An error occurred while fetching the chat completion:', error);
    throw error;
  }
}
