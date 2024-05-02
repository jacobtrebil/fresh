import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai-edge';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// export const dynamic = 'edge';
 
export async function POST(req: Request) {
  const { image } = await req.json();

  console.log("image = ", image);

  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-vision-preview',
    stream: true,
    max_tokens: 4096,
    messages: [
        {
            role: 'user',
            // @ts-ignore
            content: [
                { type: "text", text: "You are an AI that takes an image of food and creates a JSON object based on this image. Have 3 variables included: food, calories, and protein. Make sure to ONLY return a json object. NEVER return a string. example: { food: pringles, calories: 150, protein: 1 } if you're unsure of a variable, still do it and provide your best guess instead." },
                {
                    type: "image_url",
                    image_url: { 
                        "url": image
                    }
                }
            ]
        }
    ],
  });
 
  // Convert the response into a friendly text-stream
  // return response;
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

// "You are an AI that takes an image of food and creates a JSON object based on this image. Have 3 variables included: food, calories, and protein."

/* const createRequestMessages = async (req: any) => {
    // console.log("req = ", await req.text());

    const { messages, data } = await req.json();

    // console.log("messages = ", messages);
    // console.log("data = ", data);

    if (!data?.imageUrl) return messages;

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];
    return [
        ...initialMessages,
        {
            ...currentMessage, 
            content: [
                { type: "text", text: currentMessage.content },
                { type: "image", url: data.imageUrl }
            ]
        }
    ]
} */

  // const { messages, data } = await req.json();
  // console.log("req = ", await req.json());
  // const inputMessages = await req.json();
  // const messages = await req.text();
  // console.log("messages = ", messages);
  /* const completionMessage: ChatCompletionRequestMessage = {
    role: 'user',
    content: messages,
  }*/
  // const inputMessages = await createRequestMessages(req);

  // console.log("inputMessages = ", inputMessages);
  // console.log("req = ", req);
 
  // Ask OpenAI for a streaming chat completion given the prompt