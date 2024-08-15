import { OpenAIStream, StreamingTextResponse } from 'ai';
// import OpenAI from 'openai';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai-edge';
import contextPrompt from '../../../../context.js';
 
// Create an OpenAI API client (that's edge friendly!)
/* const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); */
 
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
 
export async function POST(req: Request) {
  const request = await req.json();

  console.log("request = ", request);
  console.log("request messages = ", request.messages[request.messages.length - 1]?.content);

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(config)

  const newPrompt = contextPrompt(request.messages /* request.messages[request.messages.length - 1]?.content*/);

  console.log("newPrompt = ", newPrompt);

  const prompt = `You are an AI that gives health advice. Accept a question and respond with health coach advice. 
  user question: ${request.messages[0]?.content}`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4-1106-vision-preview',
      stream: true,
      messages: [
        {
            role: 'user',
            // @ts-ignore
            content: [
                { type: "text", text: newPrompt},
            ]
        }
    ],
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error creating chat completion:', error);
  }

  /* const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-vision-preview',
    max_tokens: 4096,
    messages: [
        {
            role: 'user',
            // @ts-ignore
            content: [
                { type: "text", text: prompt},
            ]
        }
    ],
  });

  console.log("response = ", response);
  console.log("response.choices[0].message.content = ", response.choices[0].message.content); */

    // let jsonString: any = response.choices[0].message.content;

    // Remove markdown code block syntax (more robust approach)
    // jsonString = jsonString.replace(/```json\n?/g, ''); // Remove starting backticks and optional newline
    // jsonString = jsonString.replace(/\n?```/g, ''); // Remove ending backticks and optional newline

    // Trim any residual whitespace that might cause parsing issues
    // jsonString = jsonString.trim();

    // Parse the JSON string to an object
    // const jsonObject = JSON.parse(jsonString);

    // Return the JSON object
    // const stream = OpenAIStream(response);
    // return new StreamingTextResponse(response/* JSON.stringify(jsonString)*/)
 
  // Convert the response into a friendly text-stream
  // const stream = OpenAIStream(response);
  // Respond with the stream
  // return new StreamingTextResponse(stream);
}

