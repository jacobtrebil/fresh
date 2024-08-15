'use client';

import { useChat } from 'ai/react';
import { useEffect } from 'react';
import Image from 'next/image';
import pal from '../../../public/pal.png';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'api/newchat'
    // keepLastMessageOnError: true,
  });

  useEffect(() => {
    console.log("messages = ", messages);
  }, [messages]);

  return (
    <>
        <div className="chatLogoSection">
            <h1 className="logo" style={{ textAlign: "left", margin: "0 20px 0 0" }}>Buddy</h1>
            <Image className="icon" src={pal} alt="icon" width={50} />
        </div>
        <div className="messagesSection">
            {messages.map(message => (
                <div 
                    key={message.id}
                    className={`max-w-md p-4 rounded-lg ${
                    message.role === 'user'
                    ? 'userMessage bg-blue-500 text-white self-end'
                    : 'aiMessage'
                    }`}
                >
                    <p className="break-words">{message.content}</p>
                </div>
            ))}
        </div>

      <div className="chatSection">
        <div className="chatOptionsBlock">
            <div className="chatOption">
                <p>What would you change about my diet?</p>
            </div>
            <div className="chatOption">
                <p>Plan a workout program for me this week</p>
            </div><br></br>
            <div className="chatOption">
                <p>What are some of my health strengths and weaknesses</p>
            </div>
            <div className="chatOption">
                <p>How many calories did I eat yesterday?</p>
            </div>
        </div>
        <form onSubmit={handleSubmit}>
            <input 
                className="chatBox" 
                name="prompt" 
                value={input} 
                onChange={handleInputChange} 
                placeholder="Message Buddy..."
            />
        </form>
      </div>
    </>
  );
}

/*             <button type="submit">Submit</button>
               {message.role === 'user' ? 'User: ' : 'AI: '} */ 