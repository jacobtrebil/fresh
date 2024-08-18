import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai-edge';
 
export const runtime = 'edge';

export const dynamic = 'force-dynamic';
 
export async function POST(req: Request) {
  const prompt = await req.json();
  const notes = prompt.prompt.notes;

  const newPrompt2 = `You are an AI that gives health suggestions. Keep them short, 1-2 sentences.
  example: You've been snacking a lot! Reducing your eating frequency to 3 meals / day will reduce the aging damage of food
  suggestion:`;

  console.log("notes = ", notes);

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(config)

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4-1106-vision-preview',
      stream: true,
      messages: [
        {
            role: 'user',
            // @ts-ignore
            content: [
                { type: "text", text: newPrompt2},
            ]
        }
    ],
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error creating chat completion:', error);
  }
}