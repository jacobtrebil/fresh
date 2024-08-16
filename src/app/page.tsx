'use client';
import glow from "../../public/glow.png";  
import Image from "next/image";
 
export default function Chat() {

  const goToFoodDetection = () => {
    window.location.href = '/fooddetection';
  }

  const goToWhoopData = () => {
    window.location.href = '/whoop';
  }

  const goToHealthGPT = () => {
    window.location.href = '/coach';
  }

  return (
    <div className="main">
      <div className="logoSection">
        <h1 className="freshHeadline">Glow</h1>
        <Image src={glow} alt="glow" className="glow" width={100} />
      </div>
      <div className="mainButtons">
        <button className="mainButton" onClick={goToFoodDetection}>Live Analysis→</button>
        <button className="mainButton" onClick={goToHealthGPT}>Health Coach →</button>
        <button className="mainButton" onClick={goToWhoopData}>Suggestions →</button>
      </div>
    </div>
  );
}

/*       <a href="https://chat.openai.com/" target="_blank" ><button className="button">Health Coach →</button></a><br></br> */ 