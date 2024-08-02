'use client';
 
import React, { useState, useEffect} from 'react';
 
export default function FoodDetection() {

  const [image, setImage] = useState("");
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
                image: images[0],
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
          readFile(newFile);
        }
        setFiles(files => [...files, ...newFiles]);
        setFileNames([...fileNames]);
        /* e.target.files.forEach(newFiles => {
          Files.push(newFiles);
        }) */
        const file = e.target.files[0];
        setFile(file.name);
        // readFile(file);
    }

  function readFile(file: any) {
    console.log("reading file  = ", file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            console.log("reader.result = ", reader.result);
            setImages([...images, reader.result]);
            setImageCounter(imageCounter + 1);
        }
    }
  }

  useEffect(() => {
    console.log("fileNames = ", fileNames);
  }, [fileNames]);

  const PROMPT_TEMPLATE = 'You take an image and return a list of food items in the image.'

  return (
    <div className="main">
      <header>
        <h1 style={{ textAlign: "left", margin: "0 auto" }}>Fresh</h1>
      </header>
      <div className="uploadSection">
        <h2>Add Food</h2>
        <div>
          { images.map((image, index) => (
            <img key={index} src={image} alt="food" width="200" height="200"/>
          ))}
        </div>
        { !openAIResponse.food && (
          <p>{file}</p>
        )}
        <input 
          type="file"
          className= "text-sm border rounded -lg cursor-pointer"
          // accept="image/*"
          multiple
          onChange={e => handleFileChange(e)}
          // onChange={(e) => setImage(e.target.files[0])}
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

    /*         { images[0] !== "" && !openAIResponse.food ?               :
          <p></p> 
        }*/ 