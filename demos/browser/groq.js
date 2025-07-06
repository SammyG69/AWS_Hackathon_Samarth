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

✅ Be concise (under 60 words), add emojis where fitting, and include useful links if relevant.
`;

const proposalPrompt = ({ text, labelTranscript }) => `
📝 Format: **PROPOSAL**

💡 Proposed Idea:
"${labelTranscript}"

📜 Full Transcript:
${text}

You're evaluating a suggestion in context of the whole conversation. Clearly state both pros and cons, and suggest improvements or alternatives if necessary.

✅ Be direct, under 60 words, specific, include emojis and relevant links to back up points.
`;

const confusionPrompt = ({ text, labelTranscript }) => `
❓ Format: **CONFUSION**

🤔 Confused Statement:
"${labelTranscript}"

📜 Full Transcript:
${text}

You're clarifying a misunderstanding. First, understand the goal of the discussion from the full transcript. Then, kindly clarify the confusion expressed in the segment.

✅ Keep it polite, helpful, under 60 words. Use emojis and relevant resource links where applicable.
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
    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('An error occurred while fetching the chat completion:', error);
    throw error;
  }
}
