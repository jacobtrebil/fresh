'use client';
 
import React, { useState, useEffect} from 'react';
import Image from 'next/image';
import { connect } from 'http2';
 
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
  const [notes, setNotes] = useState("");

  const [deviceName, setDeviceName] = useState(""); 
  const [deviceConnectionError, setDeviceConnectionError] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [batteryLevel, setBatteryLevel] = useState("");
 
  /* useEffect(() => {
    scanForBLEDevices();
  }, []) */ 

  const handlePhotoData = async (photoDataChar) => {
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
  };

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
  
      console.log("Requesting Bluetooth Device...");
      const device = await navigator.bluetooth.requestDevice(options);

      console.log("Device selected:", device);
      if (!device) {
        console.error("No device selected!");
        setDeviceConnectionError("No device selected!");
        return;
      }
  
      console.log("Device name:", device.name);
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
      console.log("batteryService: ", batteryService);
      console.log("Attempting direct access to custom service...");
      customService = await server.getPrimaryService(customServiceUUID);
      console.log("Custom service found via direct access");

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

      // Access characteristics
      const photoDataChar = await customService.getCharacteristic('19b10005-e8f2-537e-4f6c-d104768a1214');
      const photoControlChar = await customService.getCharacteristic('19b10006-e8f2-537e-4f6c-d104768a1214');

      console.log("Photo Data Characteristic properties:", photoDataChar.properties);
      await handlePhotoData(photoDataChar);
      
      console.log("Photo Data Characteristic:", photoDataChar);
      console.log("Photo Control Characteristic:", photoControlChar);
    } catch (error) {
      console.log("Direct access failed:", error);
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

    } catch (err: any) {
      console.error('Error in BLE connection process:', err);
      setDeviceConnectionError(err.message);
    }
  };

  useEffect(() => {
    console.log("services = ", services);
  }, [services]);

  const newImages: string[] = [];

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
                notes: notes,
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
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        console.log("files length = ", files.length);
        console.log("files[i] = ", files[i]);
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

  const PROMPT_TEMPLATE = 'You take an image and return a list of food items in the image.'

  return (
    <div className="main">
      <header>
        <h1 style={{ textAlign: "left", margin: "0 auto" }}>Fresh</h1>
      </header>
      <div className="uploadSection">
        { !deviceName && (
          <button className="scan" onClick={scanForBLEDevices}>Scan For BLE Devices</button>
        )}
        { deviceName && (
          <div>
            <p className="connection">Connected to {deviceName}</p>
            <p className="batteryPercentage">Battery Level: {batteryLevel}%</p>
          </div>
        )}
        <h2>Add Food</h2>
        <div>
          { images.length > 0 && fileReadingComplete && images.map((photo, index: any) => (
            <Image className="displayImage" key={index} src={photo} alt="food" width="200" height="200"/>
          ))}
        </div>
        <input 
          type="file"
          className= "uploadFiles"
          multiple
          onChange={e => handleFileChange(e)}
        /><br></br>
          <input 
            type="text"
            className="notes"
            placeholder="Add Notes or Nutritional Values..."
            onChange={(e) => setNotes(e.target.value)}
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