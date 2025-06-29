import Groq from 'groq-sdk';

// Replace this with your actual key securely (e.g., via environment variables)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'Explain the importance of fast language models',
      },
    ],
    model: 'llama-3.3-70b-versatile',
  });
}

export async function main() {
  try {
    const chatCompletion = await getGroqChatCompletion();
    console.log(chatCompletion.choices[0]?.message?.content || '');
  } catch (error) {
    console.error('An error occurred while fetching the chat completion:', error);
  }
}

// Call the main function
main();
