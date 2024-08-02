'use client';
 
import React, { useState, useEffect} from 'react';
import Image from 'next/image';
 
export default function FoodDetection() {

  const [images, setImages] = useState<string[]>([]);
  const [file, setFile] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [imageCounter, setImageCounter] = useState(0);
  const [openAIResponse, setOpenAIResponse] = useState({
    food: "",
    calories: "",
    protein: "",
  });
  const [fileReadingComplete, setFileReadingComplete] = useState(false);
  const [fileSettingComplete, setFileSettingComplete] = useState(false);

  const newImages: string[] = [];

    async function handleSubmit() {
        if (images[0] === "") {
            window.alert('No image selected');
            return;
        }
        
        console.log("submit image = ", images[0]);
        await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: images,
            })
        })
        .then((response) => response.json())
        .then(response => setOpenAIResponse(response))
    }       

    function handleFileChange(e: any) {
        if (e.target.files === null) {
            window.alert('No file selected');
            return;
        }
        const newFiles: string[] = [];
        for (let i = 0; i < e.target.files.length; i++) {
          const newFile = e.target.files[i];
          newFiles.push(newFile);
          const fileName = newFile.name;
          fileNames.push(fileName);
        }
        setFiles(files => [...files, ...newFiles]);
        setFileNames([...fileNames]);
        setFileSettingComplete(true);
    }

  function readFile(file: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            images.push(reader.result);
            setImageCounter(imageCounter + 1);
        }
        setImages([...images]);
    }
  }

  useEffect(() => {
    console.log("files = ", files); 
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        console.log("files length = ", files.length);
        console.log("files[i] = ", files[i]);
        readFile(files[i]);
      }
      setFileReadingComplete(true);
    }
  }, [fileSettingComplete]); 

  useEffect(() => {
    console.log("fileNames = ", fileNames);
  }, [fileNames]);

  useEffect(() => {
    console.log("images = ", images);
  }, [images]);

  const PROMPT_TEMPLATE = 'You take an image and return a list of food items in the image.'

  return (
    <div className="main">
      <header>
        <h1 style={{ textAlign: "left", margin: "0 auto" }}>Fresh</h1>
      </header>
      <div className="uploadSection">
        <h2>Add Food</h2>
        <div>
          { images.length > 0 && fileReadingComplete && images.map((photo, index: any) => (
            <Image className="displayImage" key={index} src={photo} alt="food" width="200" height="200"/>
          ))}
        </div>
        <input 
          type="file"
          className= "text-sm border rounded -lg cursor-pointer"
          multiple
          onChange={e => handleFileChange(e)}
          /><br></br>
        <button type="submit" className="button" onClick={handleSubmit}>Submit</button>
        </div>
        <div className="foodLogSection">
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
    </div>
  );
}

        // newImages.push(reader.result);
        // setImages([reader.result]/* (images) => [...images, ...reader.result as string]*/);
        // onChange={(e) => setImage(e.target.files[0])}
        // accept="image/*"

        /* e.target.files.forEach(newFiles => {
          Files.push(newFiles);
        }) */
        /* const file = e.target.files[0];
        setFile(file.name); */
        /* if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            console.log("files[i] = ", files[i]);
            readFile(files[i]);
          }
        } */

    /*

            { !openAIResponse.food && files.map((file, index: any) => (
          <p key={index}>{files[index]?.name}</p>
        ))}

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

    /*         { images[0] !== "" && !openAIResponse.food ?               :
          <p></p> 
        }*/ 