'use client';
import glow from "../../public/glow.png";  
import dieScore from "../../public/dieScore.png";
import sadSun from "../../public/sadSun.png";
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
          <Image src={sadSun} alt="dieScore" className="dieScoreImg" width={150} />
          <div className="dieScoreSection">
            <p className="dieScore">Die Score</p>
            <p className="score">1.15</p>
          </div>
          <p className="streak">Streak: 5 days</p>
          <p className="suggestion">Glow: You've been snacking a lot. Reducing your eating frequency to 3 meals / day will reduce the aging damage of the foods that you eat.</p>
        </div>
      </div>
    </div>
  );
}

/*       <a href="https://chat.openai.com/" target="_blank" ><button className="button">Health Coach →</button></a><br></br> */ 