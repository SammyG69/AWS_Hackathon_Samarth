import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Prepared prompt with a placeholder for the transcript
const basePrompt = transcript => `
Imagine yourself as a third party to this casual conversation. Identify the overarching problem or goal first AND DO NOT SAY ANYTHING ONCE YOU IDENTIFY.
After identifying the goal or problem, highlight key concerns individuals are having. DO NOT SAY OR PRINT THIS
Make sure to contextualise the discussion. DO NOT PRINT THIS. Provide DETAILED, SPECIFIC, RELEVANT, NON-GENERIC, sugggestions on what can be done better by all the parties or
some ideas they may have missed that could make achievement of their goal much more better. Include DETAILED, SPECIFIC, RELEVANT, NON-GENERIC related suggestions based on the context and
not generalized ones. Provide examples where applicable, mention valid PROPER NOUNS (e.g apps, locations, games) and avoid vague sentences and generalistic advice. Provide
advice that is relatable and beneficial to the situation in hand. Keep it CONCISE AND LIMITED TO 150 words MAX

Transcript:
${transcript}
`;

export async function getGroqChatCompletion(content) {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    model: 'llama-3.1-8b-instant',
  });
}

export async function main(transcriptText) {
  try {
    const formattedPrompt = basePrompt(transcriptText);
    const chatCompletion = await getGroqChatCompletion(formattedPrompt);
    console.log(chatCompletion.choices[0]?.message?.content || '');
  } catch (error) {
    console.error('An error occurred while fetching the chat completion:', error);
  }
}

// Example transcript (replace with your actual Amazon Transcribe result)
const meetingTranscript = `
Jess: Hey Mark, I was thinking weve been talking about a trip for ages. How about finally doing that Australia getaway? Mark: Oi, yes! About time we made it happen. Where were you thinking? East coast roadie? Or something a bit more off the beaten track? Jess: I reckon we start with the classics — Sydney, Melbourne, maybe hit up the Great Ocean Road. Then we could look into Tassie or even head up to the NT for something wilder. Mark: Love that. Sydneys a must. We can do Bondi, the Harbour Bridge, catch a show at the Opera House maybe? Plus the food scene there is unreal. Jess: For sure. And maybe squeeze in the Blue Mountains? Just a short train ride — good bushwalks and some proper views. Mark: Nice one. After that we could fly to Melbourne. Ive been dying to try the laneway cafes and maybe check out a footy game if it lines up. Jess: Yep, AFL at the MCG — bucket list! And weve gotta do the Great Ocean Road while were there. Ive heard the Twelve Apostles are stunning at sunset. Mark: You know what would be epic? Hiring a campervan for that stretch. Just hit the road, stop wherever we fancy, live a bit wild. Jess: Im totally up for that. We could take turns driving and camp by the beach. Ill sort the Spotify playlists! Mark: Deal. After Victoria, what about heading up to Queensland? Maybe the Whitsundays or even the Daintree? Jess: Thats a solid shout. Ive always wanted to snorkel the Great Barrier Reef. And Cairns is a great base for that. Mark: True. Could even do a bit of hiking in the rainforest if were up for it. Or we just chill with a beer by the water. Jess: Bit of both, I reckon. So whats the vibe — three weeks? A month? Mark: Id say four weeks if we can both swing the leave. That way were not rushing and can chuck in a few surprises. Jess: Speaking of surprises, Id love to end with Uluru. Something about seeing the sunrise there just feels… iconic. Mark: Mate, thats magic. Alice Springs to Uluru is a bit of a trek, but its proper Aussie outback. Could be the perfect way to wrap it all up. Jess: Agreed. Alright, Ill start researching flights and campervan hire. You sort out an itinerary draft? Mark: You got it. Ill look into campsites, national parks passes, and all the good eats along the way. Jess: Oh, and lets do this eco-friendly, yeah? Refill bottles, keep it sustainable, support local. Mark: Absolutely. No single-use plastics, and we shop at local markets where we can. Aussie produce is the best anyway. Jess: Im so excited now. This is going to be epic! Mark: Its happening! Australia, here we come.
`;

main(meetingTranscript);
