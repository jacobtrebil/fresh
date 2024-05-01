'use client';
 
import { useCompletion } from 'ai/react';
import React, { useState, ChangeEvent } from 'react';
 
export default function FoodDetection() {
  const {  input, handleInputChange, handleSubmit, completion, complete } = useCompletion({ api: '/api/chat' });

  const [image, setImage] = useState<string>("");
  const [openAIResponse, setOpenAIResponse] = useState<string>("");

    function handleImageChange(e: any) {
        const imageData = e.target.files[0];
        setImage(imageData);
    }

    function callAPI() {
        if (image !== null) {
            console.log(image);
            console.log(PROMPT_TEMPLATE);
            complete(PROMPT_TEMPLATE/*, image*/);
        }
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
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

  return (
    <div className="main">
      <h1>Food Detection</h1>
      { image !== "" ?
        <img style={{ textAlign: "center", margin: "0 auto" }} src={image} alt="food" width="200" height="200"/>
            :
        <p>No image selected</p> 
      }
      <input 
        type="file"
        className= "text-sm border rounded -lg cursor-pointer"
        // accept="image/*"
        onChange={e => handleFileChange(e)}
        // onChange={(e) => setImage(e.target.files[0])}
        /><br></br>
      <button type="submit" className="button" onClick={callAPI}>Submit</button>
      <p>{completion}</p>
    </div>
  );
}