import OpenAI from 'openai';
// import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai-edge';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
export const dynamic = 'force-dynamic';
 
export async function POST(req: Request) {
  const { notes } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-vision-preview',
    max_tokens: 4096,
    messages: [
        {
            role: 'user',
            // @ts-ignore
            content: [
                { type: "text", text: `You are an AI that gives health advice. Accept a question and respond with health coach advice.`},
            ]
        }
    ],
  });

    let jsonString = response.choices[0].message.content;

    // Remove markdown code block syntax (more robust approach)
    jsonString = jsonString.replace(/```json\n?/g, ''); // Remove starting backticks and optional newline
    jsonString = jsonString.replace(/\n?```/g, ''); // Remove ending backticks and optional newline

    // Trim any residual whitespace that might cause parsing issues
    jsonString = jsonString.trim();

    // Parse the JSON string to an object
    const jsonObject = JSON.parse(jsonString);

    // Return the JSON object
    return new Response(JSON.stringify(jsonObject))
 







  // Convert the response into a friendly text-stream
  // const stream = OpenAIStream(response);
  // Respond with the stream
  // return new StreamingTextResponse(stream);
}