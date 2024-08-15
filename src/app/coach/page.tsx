'use client';

import { useChat } from 'ai/react';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import pal from '../../../public/pal.png';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'api/newchat'
    // keepLastMessageOnError: true,
  });

  const [inputValue, setInputValue] = useState('');
  const [shouldSubmit, setShouldSubmit] = useState(false);

  useEffect(() => {
    console.log("messages = ", messages);
  }, [messages]);

  const setPredefinedInput = (text: any) => {
    // Create a synthetic event
    const syntheticEvent = {
      target: { value: text },
      preventDefault: () => {}
    };
    
    // Call handleInputChange with our synthetic event
    handleInputChange(syntheticEvent);
    // handleSubmit(syntheticEvent);
  };

  const setInputAndSubmit = useCallback((text: any) => {
    setPredefinedInput(text);
    setShouldSubmit(true);
  }, [setPredefinedInput]);

  useEffect(() => {
    if (shouldSubmit) {
      handleSubmit({ preventDefault: () => {} });
      setShouldSubmit(false);
    }
  }, [shouldSubmit, handleSubmit]);

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
        { messages.length === 0 && (
        <div className="chatOptionsBlock">
            <button 
                className="chatOption"
                onClick={() => setInputAndSubmit("What would you change about my diet?")}
            >What would you change about my diet?</button>
            <button 
                className="chatOption"
                onClick={() => setInputAndSubmit("Plan a workout program for me this week")}
            >
                <p>Plan a workout program for me this week</p>
            </button><br></br>
            <button 
                className="chatOption"
                onClick={() => setInputAndSubmit("What are some of my health strengths and weaknesses?")}
            >
                <p>What are some of my health strengths and weaknesses</p>
            </button>
            <button 
                className="chatOption"
                onClick={() => setInputAndSubmit("How many calories did I eat yesterday?")}
            >
                <p>How many calories did I eat yesterday?</p>
            </button>
        </div>
        )}
        <form onSubmit={handleSubmit}>
            <input 
                className="chatBox" 
                name="prompt"
                value={input} 
                onChange={handleInputChange}
                /* value={inputValue} 
                onChange={e => {setInputValue(e.target.value)}} */
                placeholder="Message Buddy..."
            />
        </form>
      </div>
    </>
  );
}

/*             <button type="submit">Submit</button>
               {message.role === 'user' ? 'User: ' : 'AI: '} */ 