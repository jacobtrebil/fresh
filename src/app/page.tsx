'use client';
import glow from "../../public/glow.png";  
import dieScore from "../../public/dieScore.png";
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
        <Image src={glow} alt="glow" className="glow" width={60} />
      </div>
      <div className="mainButtons">
        <button className="mainButton" onClick={goToFoodDetection}>Live Analysis→</button>
        <button className="mainButton" onClick={goToHealthGPT}>Health Coach →</button>
        <div className="suggestionsSection">
          <Image src={dieScore} alt="dieScore" className="dieScoreImg" width={100} />
          <p className="dieScore">Die Score: 0.1</p>
          <p className="streak">Streak: 5 days</p>
          <p className="tip">Daily tip:</p>
          <p className="suggestion">You've been snacking a lot. Reducing your eating frequency to 3 meals / day will reduce the aging damage of the foods that you eat.</p>
        </div>
      </div>
    </div>
  );
}

/*       <a href="https://chat.openai.com/" target="_blank" ><button className="button">Health Coach →</button></a><br></br> */ 