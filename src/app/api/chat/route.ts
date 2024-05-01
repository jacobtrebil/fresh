import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai-edge';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
export const dynamic = 'edge';
 
export async function POST(req: Request) {
  const { image } = await req.json();

  console.log("image = ", image);

  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    stream: true,
    max_tokens: 4096,
    messages: [
        {
            role: 'system',
            //@ts-ignore
            content: [
                // { type: "text", text: "What's in this image?" },
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
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}


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