'use client';

import { useChat } from 'ai/react';
import { useEffect } from 'react';

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
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
