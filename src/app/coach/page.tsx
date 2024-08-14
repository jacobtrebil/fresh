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
                <div key={message.id}>
                {message.role === 'user' ? 'User: ' : 'AI: '}
                {message.content}
                </div>
            ))}
        </div>

      <div className="chatSection">
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

/*             <button type="submit">Submit</button> */ 