'use client';
 
import { useCompletion } from 'ai/react';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { ReadableStreamDefaultReadResult } from 'stream/web';
 
export default function FoodDetection() {
  // const {  input, handleInputChange, handleSubmit, completion, complete } = useCompletion({ api: '/api/chat' });

  const [image, setImage] = useState("");
  const [openAIResponse, setOpenAIResponse] = useState("");

    function handleImageChange(e: any) {
        const imageData = e.target.files[0];
        setImage(imageData);
    }

    function callAPI() {
        if (image !== null) {
            console.log(image);
            console.log(PROMPT_TEMPLATE);

            // complete(PROMPT_TEMPLATE/*, image*/);
        }
    }

    async function handleSubmit() {
        if (image === "") {
            window.alert('No image selected');
            return;
        }

        await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: image,
            })
        })
        .then(async (response) => {
            const reader = response.body?.getReader();

            while (true) {
                const readerResult = await reader?.read();
                const { done, value } = readerResult as ReadableStreamDefaultReadResult<Uint8Array>;
                // const { value } = await reader?.read();
                if (done) {
                    break;
                }
                setOpenAIResponse((prev) => prev + new TextDecoder().decode(value));
                /* var currentChunk = new TextDecoder().decode(value);
                console.log("value =", value);
                console.log("currentChunk = ", currentChunk);
                setOpenAIResponse((prev) => prev + currentChunk); */
            }
        })
    }       

    function handleFileChange(e: any) {
        if (e.target.files === null) {
            window.alert('No file selected');
            return;
        }
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                console.log("reader.result = ", reader.result);
                setImage(reader.result);
            }
        }
    }

  const PROMPT_TEMPLATE = 'You take an image and return a list of food items in the image.'

    useEffect(() => {
      console.log("image = ", image);
    }, [image])

  return (
    <div className="main">
      <h1>Food Detection</h1>
      { image !== "" ?
        <img style={{ textAlign: "center", margin: "0 auto" }} src={image} alt="food" width="200" height="200"/>
            :
        <p></p> 
      }
      <input 
        type="file"
        className= "text-sm border rounded -lg cursor-pointer"
        // accept="image/*"
        onChange={e => handleFileChange(e)}
        // onChange={(e) => setImage(e.target.files[0])}
        /><br></br>
      <button type="submit" className="button" onClick={handleSubmit}>Submit</button>
      { openAIResponse !== "" ? <p>Response: {openAIResponse}</p> : null}
      <p>{openAIResponse}</p>
    </div>
  );
}