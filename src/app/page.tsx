'use client';
import glow from "../../public/glow.png";  
import dieScore from "../../public/dieScore.png";
import sadSun from "../../public/sadSun.png";
import fresh from "../../public/freshleaf.png";
import veggies from "../../public/grapes.png";
import leaf from "../../public/leaf22.png";
import Image from "next/image";
 
export default function Chat() {

  const goToFoodDetection = () => {
    window.location.href = '/fooddetection';
  }

  const goToHealthGPT = () => {
    window.location.href = '/coach';
  }

  const goToNutritionTracking = () => {
    window.location.href = '/tracking';
  }

  return (
    <div className="main">
      <div className="logoSection">
        <h1 className="freshHeadline">Fresh</h1>
        <Image src={leaf} alt="leaf" className="glow" width={60} />
      </div>
      <div className="glowBubbleSection">
        <div className="glowSuggestionBubble">
          <p className="suggestion">You've been snacking a lot! Reducing your eating frequency to 3 meals / day will reduce the aging damage of food</p>
        </div>
      </div>
      <div className="mainButtons">
        <button className="mainButton" onClick={goToFoodDetection}>Live Analysis→</button>
        <button className="mainButton" onClick={goToHealthGPT}>Health Coach →</button>
      </div>
    </div>
  );
}

/*       <a href="https://chat.openai.com/" target="_blank" ><button className="button">Health Coach →</button></a><br></br> */ 

/* 

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

  const data = [
    {
      name: 'Monday',

      amt: 0.9,
    },
    {
      name: 'Tuesday',
      amt: 0.95,
    },
    {
      name: 'Wednesday',
      amt: 1.1,
    },
    {
      name: 'Thursday',
      amt: 0.8,
    },
    {
      name: 'Friday',
      amt: 0.85,
    },
    {
      name: 'Saturday',
      amt: 1.02,
    },
    {
      name: 'Sunday',
      amt: 1,
    },
  ];

          <button className="mainButton" onClick={goToNutritionTracking}>Nutrition Log →</button>
          <p className="streak">Streak: 5 days</p>
          <p className="suggestion">Glow: You've been snacking a lot! Reducing your eating frequency to 3 meals / day will reduce the aging damage of food</p>

          <div className="suggestionsSection">
            <div className="dieScoreFullSection">
              <Image src={sadSun} alt="dieScore" className="dieScoreImg" width={150} />
              <div className="dieScoreSection">
                <p className="dieScore">Die Score</p>
                <p className="score">1.15</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={300} height={50} data={data}>
              <Line type="monotone" dataKey="pv" stroke="#FADA07" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

*/ 