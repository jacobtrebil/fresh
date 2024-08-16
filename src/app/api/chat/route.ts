import { OpenAIStream, StreamingTextResponse } from 'ai';
// import OpenAI from 'openai';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai-edge';
 
export const runtime = 'edge';

// Create an OpenAI API client (that's edge friendly!)
/* const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); */
 
export const dynamic = 'force-dynamic';
 
export async function POST(req: Request) {
  const prompt = await req.json();
  // console.log("prompt = ", prompt);
  // const { notes, images } = await req.json();
  const notes = prompt.prompt.notes;
  const images = prompt.prompt.images;

  console.log("notes = ", notes);
  console.log("images = ", images);

  const newPrompt = `You are an AI that accepts a set of images taken from a necklace with a camera and you return a description of context and insights from the scene. 
  You are sometimes given previous context as well. If you are given previous context, include the most interesting, insightful, and unique context and add all new context to your response as well. 
  ALWAYS give an answer between 4 and 7 sentences. Do not mention context about the camera or necklace taking the photos. Just the subject and environment. 
  Do not mention previous sets / photos. Just give the overall context from all of the sets / photos combined with past context.
  previous context and insights: ${notes} context and insights: `;

  const newPrompt2 = `You are an AI that accepts a set of images taken from a necklace with a camera and you return a description of health / wellness context and insights from the scene. 
  You are sometimes given previous context as well. If you are given previous context, include the most interesting, insightful, and unique context and add all new context to your response as well. 
  Focus on detecting food from the scene, looking for health data about the user, and displaying this data is key. 
  ALWAYS give an answer between 2 and 5 sentences. Do not mention context about the camera or necklace taking the photos. Just health / wellness related insights about the subject and environment. 
  Do not mention previous sets / photos. Just give the overall context from all of the sets / photos combined with past context.
  previous context and insights: ${notes} context and insights: `;

  console.log("notes = ", notes);
  console.log("images = ", images);
  // console.log("images = ", images.length);

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
                ...images.map((image: any) => (
                  {
                    type: "image_url",
                    image_url: { 
                        "url": `data:image/jpeg;base64,${image}`
                    }
                }))
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
                ...images.map((image: any) => (
                  {
                    type: "image_url",
                    image_url: { 
                        "url": `data:image/jpeg;base64,${image}`
                    }
                }))
            ]
        }
    ],
  }); */

  // console.log("response = ", response);

  // Convert the response into a friendly text-stream
  // const stream = OpenAIStream(response);
  // return new StreamingTextResponse(stream);
  // Create a new Response object using the stream
  // const res = new Response(stream.body, stream);
  // Respond with the new Response object

    // let jsonString = response.choices[0].message.content;

    // console.log("jsonString = ", jsonString);
    
    // Remove markdown code block syntax (more robust approach)
    // jsonString = jsonString.replace(/```json\n?/g, ''); // Remove starting backticks and optional newline
    // jsonString = jsonString.replace(/\n?```/g, ''); // Remove ending backticks and optional newline
    
    // Trim any residual whitespace that might cause parsing issues
    // jsonString = jsonString.trim();
    
    // Parse the JSON string to an object
    // const jsonObject = jsonString ? JSON.parse(jsonString) : {};
    
    // Return the JSON object
    // return new Response(JSON.stringify(/*jsonObject */jsonString))
 







  // Convert the response into a friendly text-stream
  // const stream = OpenAIStream(response);
  // Respond with the stream
  // return new StreamingTextResponse(stream);
}

// OLD Prompt

/* `You are an AI that takes an image of food and creates a JSON object based on this image. Have 3 variables included: food, calories, and protein. Make sure to ONLY return a SINGLE json object. NEVER return a string or an array. example1: { food: pringles, calories: 200, protein: 1 }, example2: { food: chicken and carrots, calories: 270, protein: 22 } if you're unsure of a variable, still do it and provide your best guess instead. If there are multiple images, add all the foods to the same foods variable. user notes: ${notes}` */

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