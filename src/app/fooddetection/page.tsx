'use client';
 
import { useCompletion } from 'ai/react';
import React, { useState, ChangeEvent, FormEvent, useEffect, useCallback } from 'react';
import { ReadableStreamDefaultReadResult } from 'stream/web';
import { readStreamableValue } from 'ai/rsc';
 
export default function FoodDetection() {
  // const {  input, handleInputChange, handleSubmit, completion, complete } = useCompletion({ api: '/api/chat' });

  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [imageCounter, setImageCounter] = useState(0);
  const [openAIResponse, setOpenAIResponse] = useState({
    food: "",
    calories: "",
    protein: "",
  });

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
        .then((response) => response.json())
        .then(response => setOpenAIResponse(response));
        /* .then(async (response) => {
            const reader = response.body?.getReader();

            while (true) {
                const readerResult = await reader?.read();
                const { done, value } = readerResult as ReadableStreamDefaultReadResult<Uint8Array>;
                // const { value } = await reader?.read();
                if (done) {
                    break;
                }
                // setOpenAIResponse((prev) => prev + new TextDecoder().decode(value));
                var currentChunk = new TextDecoder().decode(value);
                setOpenAIResponse((prev) => prev + currentChunk);
            }
        }) */
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
                setImageCounter(imageCounter + 1);
            }
        }
    }

    useEffect(() => {
        console.log("imageCounter = ", imageCounter);
    }, [imageCounter])

    // Could just add a counter and append it to the end + add to the counter each time

  const PROMPT_TEMPLATE = 'You take an image and return a list of food items in the image.'

    useEffect(() => {
      console.log("image = ", image);
      console.log("typeof image = ", typeof image);
    }, [image])

    useEffect(() => {
        console.log("openAIResponse = ", openAIResponse);
        console.log("typeof openAIResponse = ", typeof openAIResponse);
    }, [openAIResponse])

  return (
    <div className="main">
      <header>
        <h1 style={{ textAlign: "left", margin: "0 auto" }}>Fresh</h1>
      </header>
      <div className="uploadSection">
        <h2>Add Food</h2>
        { image !== "" ?
          <img src={image} alt="food" width="200" height="200"/>
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
        </div>
          { openAIResponse?.food !== "" ? 
          <div className="foodLog">
            <div className="day">
              <h2>Today</h2>
              <p><b>Foods:</b> {openAIResponse?.food}</p>
              <p><b>Calories:</b> {openAIResponse?.calories}</p>
              <p><b>Protein:</b> {openAIResponse?.protein}</p>
            </div>
        </div> : null}
          <div className="foodLog">
            <div className="day">
              <h2>Yesterday</h2>
              <p><b>Foods:</b> Chicken, Broccoli, Potatoes, Pasta</p>
              <p><b>Calories:</b> 2,055</p>
              <p><b>Protein:</b> 117</p>
            </div>
        </div>
    </div>
  );
}

    /*

        <p>{new Date().toLocaleString()}</p>
        <div className="foodLog">
        <div className="day">
          <h2 className="dayTitle">July 31st</h2>
          <p>Calories: 2,150</p>
          <p>Protein: 120</p>
        </div>
      </div>
    
    function callAPI() {
        if (image !== null) {
            console.log(image);
            console.log(PROMPT_TEMPLATE);

            // complete(PROMPT_TEMPLATE/);
        }
    } */

    /* function handleImageChange(e: any) {
        const imageData = e.target.files[0];
        setImage(imageData);
    } */