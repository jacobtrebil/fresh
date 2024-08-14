'use client';
 
import React, { useState, useEffect} from 'react';
import Image from 'next/image';
import { connect } from 'http2';
import icon from "../../../public/icon.png";
import pepper from "../../../public/pepper.png";
import grapes from "../../../public/grapes.png";
import veggies from "../../../public/veggies.png";
import pal from "../../../public/pal.png";
import { AIStreamParser } from 'ai';
 
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
  const [newOpenAIResponse, setNewOpenAIResponse] = useState("");
  const [fileReadingComplete, setFileReadingComplete] = useState(false);
  const [fileSettingComplete, setFileSettingComplete] = useState(false);
  const [notes, setNotes] = useState("");

  const [deviceName, setDeviceName] = useState(""); 
  const [deviceConnectionError, setDeviceConnectionError] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [batteryLevel, setBatteryLevel] = useState("");
  const [base64Img, setBase64Img] = useState("");

  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [base64ImagesSet, setBase64ImagesSet] = useState(false);
  const [isFirstImageSkipped, setIsFirstImageSkipped] = useState(false);
  const [photoCounter, setPhotoCounter] = useState(0);

  function parseOpenAIStream() : AIStreamParser {
    let previous = '';

    return data => {
      const json = JSON.parse(data) as {
        completion: string;
        stop: string | null;
        stop_reason: string | null;
        truncated: boolean;
        log_id: string;
        model: string;
        exception: string | null;
      };

      const text = json.completion;
      return text
    }
  }
 
  /* useEffect(() => {
    scanForBLEDevices();
  }, []) */ 

  /* const handlePhotoData = async (photoDataChar) => {
    try {
      console.log("Setting up notifications for Photo Data Characteristic...");
  
      // Check if notifications are supported
      if (!photoDataChar.properties.notify) {
        console.error("Notifications not supported for this characteristic");
        return;
      }
  
      // Start notifications
      await photoDataChar.startNotifications();
      console.log("Notifications started successfully");
  
      // Attempt to read the current value
      const initialValue = await photoDataChar.readValue();
      console.log("Initial characteristic value:", new Uint8Array(initialValue.buffer));
  
      // Set up the event listener for characteristic value changes
      photoDataChar.addEventListener('characteristicvaluechanged', (event) => {
        console.log("Characteristic value changed event triggered");
        const value = event.target.value;
        
        // Process the received data
        const photoData = new Uint8Array(value.buffer);
        console.log("Received photo data:", photoData);
  
        // Example: Convert data to a base64 string if it's image data
        const base64Data = btoa(String.fromCharCode.apply(null, photoData));
        console.log("Photo data as base64:", base64Data);
  
        // TODO: Add your specific data processing logic here
      });
  
      console.log("Event listener set up successfully");
  
      // Set up an interval to check if we're still receiving data
      setInterval(async () => {
        try {
          const value = await photoDataChar.readValue();
          console.log("Periodic check - Current value:", new Uint8Array(value.buffer));
        } catch (error) {
          console.error("Error reading characteristic value:", error);
        }
      }, 10000); // Check every 10 seconds
  
    } catch (error) {
      console.error("Error setting up photo data notifications:", error);
    }
  }; */

  const scanForBLEDevices = async () => {
    try {
      console.log("Starting BLE connection process...");
      
      if (!navigator.bluetooth) {
        console.error("Web Bluetooth API is not available in your browser!");
        setDeviceConnectionError("Web Bluetooth API is not available in your browser!");
        return;
      }

      const options = {
        filters: [
          { services: [ 'battery_service' /* '19B10000-E8F2-537E-4F6C-D104768A1214' 'battery_service'*/ ]},  // Example: Look for devices with battery service
          { namePrefix: 'BLE' },              // Example: Look for devices with names starting with 'BLE'
          // Add more filters as needed
        ],
        optionalServices: [
          '19b10000-e8f2-537e-4f6c-d104768a1214',  // Custom Main Friend Service
          '0000180f-0000-1000-8000-00805f9b34fb',  // Battery Service
          '0000180a-0000-1000-8000-00805f9b34fb'   // Device Information Service
        ]
        /* optionalServices: ['19B10000-E8F2-537E-4F6C-D104768A1214',  // Main Friend Service
        '19B10005-E8F2-537E-4F6C-D104768A1214',  // Photo Data
        '19B10006-E8F2-537E-4F6C-D104768A1214',  // Photo Control
        '180a'] */  // Example: Additional services you might want to interact with
      };
  
      const device = await navigator.bluetooth.requestDevice(options);

      if (!device) {
        setDeviceConnectionError("No device selected!");
        return;
      }
  
      setDeviceName(device.name || 'Unnamed device');
  
      console.log("Connecting to GATT Server...");
      const server = await device.gatt?.connect();
      console.log("GATT Server:", server);
      
      if (!server) {
        console.error("Failed to connect to GATT server!");
        setDeviceConnectionError("Failed to connect to GATT server!");
        return;
      }

      console.log("Getting Main Friend Service...");
    // Try to access the custom service
    const customServiceUUID = '19b10000-e8f2-537e-4f6c-d104768a1214';
    const batteryServiceUUID = '0000180f-0000-1000-8000-00805f9b34fb';
    let customService;
    let batteryService;

    // Method 1: Direct access
    try {
      batteryService = await server.getPrimaryService(batteryServiceUUID);
      customService = await server.getPrimaryService(customServiceUUID);
    
      // Battery Level characteristic UUID
      const batteryLevelCharUUID = '00002a19-0000-1000-8000-00805f9b34fb';
    
      // Get the Battery Level characteristic
      const batteryLevelChar = await batteryService.getCharacteristic(batteryLevelCharUUID);
    
      // Read the battery level value
      const batteryLevelData = await batteryLevelChar.readValue();
    
      // The battery level is typically a single byte value (0-100)
      const batteryLevel = batteryLevelData.getUint8(0);
    
      setBatteryLevel(batteryLevel);
    
      console.log(`Battery Level: ${batteryLevel}%`);
    
      /* console.log("Photo Data Characteristic:", photoDataChar);
      console.log("Photo Control Characteristic:", photoControlChar); */
    } catch (error: any) {
      console.error("Error details:");
      console.error("Name:", error.name);
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      
      if (error instanceof DOMException) {
        console.error("DOMException code:", error.code);
      }
      
      // Optionally, you can add specific error handling based on the error type
      if (error.name === "NotFoundError") {
        console.error("A required service or characteristic was not found.");
      } else if (error.name === "SecurityError") {
        console.error("The operation is not permitted in the current security context.");
      } else if (error.name === "NotSupportedError") {
        console.error("The operation is not supported by the device or browser.");
      }
    }

    // Method 2: Discover all services and filter
    if (!customService) {
      console.log("Attempting to discover all services...");
      const services = await server.getPrimaryServices();
      customService = services.find((service: { uuid: string; }) => service.uuid.toLowerCase() === customServiceUUID);
      if (customService) {
        console.log("Custom service found via discovery");
      }
    }

      /* const mainService = await server.getPrimaryService('19B10000-E8F2-537E-4F6C-D104768A1214');
      console.log("Main Friend Service:", mainService);
  
      if (mainService) {
        console.log("Main Friend Service found. Checking for photo characteristics...");
        const photoDataChar = await mainService.getCharacteristic('19B10005-E8F2-537E-4F6C-D104768A1214');
        const photoControlChar = await mainService.getCharacteristic('19B10006-E8F2-537E-4F6C-D104768A1214');
  
        if (photoDataChar && photoControlChar) {
          console.log("Photo service characteristics found!");
          // Here you can set up handlers for the photo service
        } else {
          console.log("Photo service characteristics not found.");
        }
      } else {
        console.log("Main Friend Service not found.");
      } */
  
      // Clear any previous errors
      setDeviceConnectionError("");
  
      console.log('Successfully connected to device:', device.name);

      const services = await server.getPrimaryServices();
      services.forEach((service: { uuid: any; }) => {
        console.log('Service found:', service.uuid);
      });
      setServices(services);
      triggerCapture(customService);


    } catch (err: any) {
      console.error('Error in BLE connection process:', err);
      setDeviceConnectionError(err.message);
    }
  };

  async function triggerCapture(customService: any) { 
    try {
      // Access characteristics
      const photoDataChar = await customService.getCharacteristic('19b10005-e8f2-537e-4f6c-d104768a1214');
      const photoControlChar = await customService.getCharacteristic('19b10006-e8f2-537e-4f6c-d104768a1214');
          
      await triggerPhotoCaptureNew(photoControlChar);
      await handlePhotoData(photoDataChar, photoControlChar);
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  async function triggerPhotoCaptureNew(photoControlCharacteristic: any) {
    try {
      // Write a null value to the characteristic
      await photoControlCharacteristic.writeValue(new ArrayBuffer(10));
      console.log("Photo capture triggered successfully");
    } catch (error) {
      console.error("Error triggering photo capture:", error);
    }
  }

  const handlePhotoData = async (photoDataChar: any, photoControlChar: any) => {
    console.log("getting handlePhotoData");
    let captureState = 'idle';
    let accumulatedData = new Uint8Array();
  
    const triggerPhotoCapture = async () => {
      console.log("Triggering photo capture...");
      captureState = 'capturing';
      try {
        // Assuming 1 means "start capture". Adjust based on device specifications.
        await photoControlChar.writeValue(new Uint8Array([1]));
        console.log("Photo capture triggered");
      } catch (error) {
        console.error("Error triggering photo capture:", error);
        captureState = 'idle';
      }
    };
  
    const readPhotoControlChar = async () => {
      try {
        const value = await photoControlChar.readValue();
        console.log("Photo Control Characteristic value:", new Uint8Array(value.buffer));
      } catch (error) {
        console.error("Error reading Photo Control Characteristic:", error);
      }
    };

    let isFirstPhoto = true;
    let photoCounter = 0;
  
    // Set up notifications for Photo Data Characteristic
    await photoDataChar.startNotifications();
    photoDataChar.addEventListener('characteristicvaluechanged', (event) => {
      const value = new Uint8Array(event.target.value.buffer);
      
      if (value.length > 0) {
        accumulatedData = new Uint8Array([...accumulatedData, ...value.slice(2)]);
        if (isPhotoComplete(accumulatedData)) {
          console.log("Photo capture complete");
          if (isFirstPhoto) {
            console.log("Skipping first photo");
            isFirstPhoto = false;
          } else {
            console.log("Photo capture complete");
            processPhoto(accumulatedData);
            photoCounter++;
          }
          setPhotoCounter(photoCounter);
          // processPhoto(accumulatedData);
          accumulatedData = new Uint8Array();
          captureState = 'idle';
          setBase64ImagesSet(true);
        }
      } else {
        console.log("Received empty data packet");
      }
    });
  
    // Set up notifications for Photo Control Characteristic
    /* await photoControlChar.startNotifications();
    console.log("getting past await 2");
    photoControlChar.addEventListener('characteristicvaluechanged', (event) => {
      console.log("Photo Control Characteristic value changed");
      const value = new Uint8Array(event.target.value.buffer);
      console.log("Control data:", value);
      // Interpret control data and update state as needed
    }); */
  
    // Periodic check and trigger
    /* setInterval(async () => {
      if (captureState === 'idle') {
        await readPhotoControlChar();
        await triggerPhotoCapture();
      }
    }, 10000); // Check every 10 seconds */
  
    console.log("Photo capture handler set up");
  }; 
  
  // Helper function to check if we've received a complete photo
  // Adjust this based on your device's protocol
  const isPhotoComplete = (data) => {
    // Example: Check for JPEG end marker
    return data.length > 2 && data[data.length - 2] === 0xFF && data[data.length - 1] === 0xD9;
  };
  
  // Process the complete photo data
  const processPhoto = (data) => {
    const base64Data = btoa(String.fromCharCode.apply(null, data));
    console.log("Photo data as base64:", base64Data);
    setBase64Img(base64Data);
    base64Images.push(base64Data);
    // base64Images.push(base64Data);
    if (base64Images.length > 9) {
      base64Images.shift();
    }
      setBase64Images([...base64Images]);
    // TODO: Display or further process the photo
  };

  const newImages: string[] = [];

  useEffect(() => {
    console.log("photoCounter = ", photoCounter);
    console.log("photoCounter % 3 = ", photoCounter % 3);
    if (photoCounter !== 0 && photoCounter % 3 === 0) {
      handleSubmit();
    }
  }, [base64Images])

    async function handleSubmit() {
        if (images[0] === "") {
            window.alert('No image selected');
            return;
        }

        await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                notes: newOpenAIResponse,
                images: base64Images,
            })
        })
        .then((response) => response.json())
        .then(response => setNewOpenAIResponse(response))
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
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        readFile(files[i]);
      }
      setFileReadingComplete(true);
    }
  }, [fileSettingComplete]); 

  /* useEffect(() => {
    console.log("fileNames = ", fileNames);
  }, [fileNames]);

  useEffect(() => {
    console.log("images = ", images);
  }, [images]); */

  useEffect(() => {
    console.log("openAIResponse = ", openAIResponse);
  }, [openAIResponse]);

  const PROMPT_TEMPLATE = 'You take an image and return a list of food items in the image.'

  return (
    <div className="main">
      <header>
        <div className="logoSection">
          <h1 className="logo" style={{ textAlign: "left", margin: "0 20px 0 0" }}>Buddy</h1>
          <Image className="icon" src={pal} alt="icon" width={50} />
        </div>
        { !deviceName && (
          <div className="headerRight">
            <button className="scan" onClick={scanForBLEDevices}>Connect Your Buddy</button>
          </div>
        )}
        { deviceName && (
          <div className="headerRight">
            <p className="connection">Connected to {deviceName}</p>
            <p className="batteryPercentage">Battery: <b>{batteryLevel}%</b></p>
          </div>
        )}
      </header>
      <div className="uploadSection">
        <h2>Live Photo Stream</h2>
        <div>
        { base64ImagesSet && base64Images.length === 0 && (
          <p className="loadingMessage">First photo takes 10-15 seconds...</p>
        )}
        { base64Images.length > 0 && base64ImagesSet && base64Images.map((base64image, index: any) => (
          <Image className="displayImage" key={index} src={`data:image/jpeg;base64,${base64image}`} alt="food" width="200" height="200"/>
        ))}
        </div>
        </div>
          <div className="contextSection">
            <h2 className="aiAnalysis">Understanding</h2>
            { base64Images.length > 0 && base64Images.length < 4 && !newOpenAIResponse && (
              <p className="aiLoadingMessage">Buddy will analyze 3 photos at a time...</p>
            )}
            { newOpenAIResponse && (
            <p className="understandingText">{newOpenAIResponse}</p>
            )}
          </div>
    </div>
  );
}

/*           <input 
            type="text"
            className="notes"
            placeholder="Add Notes or Nutritional Values..."
            onChange={(e) => setNotes(e.target.value)}
          /><br></br>
        <button type="submit" className="button" onClick={handleSubmit}>Process</button>
        
                <div className="foodLogSection">
                </div>*/

/*         { !deviceName && (
          <button className="scan" onClick={scanForBLEDevices}>Scan For BLE Devices</button>
        )}
        { deviceName && (
          <div>
          </div>
        )} */

/* 

        <input 
          type="file"
          className= "uploadFiles"
          multiple
          onChange={e => handleFileChange(e)}
        /><br></br>

{ images.length > 0 && fileReadingComplete && images.map((photo, index: any) => (
            <Image className="displayImage" key={index} src={photo} alt="food" width="200" height="200"/>
          ))} */ 

// <p className="notesTitle">Add Notes or Nutritional Values</p>

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