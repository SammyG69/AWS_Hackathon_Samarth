import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const REGION = 'us-east-1'; // Claude is available only in this region
const client = new BedrockRuntimeClient({ region: REGION });

const sendToClaude = async prompt => {
  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    }),
  });

  try {
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log("Claude's response:\n", responseBody.content?.[0]?.text);
  } catch (err) {
    console.error('Error invoking Claude:', err);
  }
};

await sendToClaude('Top 2 favourite chess openings');
