'use client';
 
import React, { useState, useEffect} from 'react';
import Image from 'next/image';
import fresh from "../../../public/leaf22.png";
 
export default function User() {

  return (
    <div>
      <header>
        <div className="liveLogoSection">
          <h1 className="liveLogo">Fresh</h1>
          <Image className="icon" src={fresh} alt="icon" width={60} />
        </div>
        <div style={{ float: "right", margin: "40px 40px 0 0", fontSize: "1.25rem", fontWeight: "900", fontFamily: "Questrial" }}>
            <p>Jacob Trebil</p>
          </div>
      </header>
      <div className="userContext"> 
        <h2 style={{ margin: "40px 0 0 40px", fontFamily: "Questrial" }} >Today:</h2>
        <p style={{ margin: "20px 0 0 45px", fontSize: "1rem", fontFamily: "Questrial" }}>Jacob has eaten 1,300 calories and 62g protein so far today. He has had 1tbsp of extra virgin olive oil and an estimated 11g of fiber. He has consumed a bowl of yogurt, coffee, pastry, beef stick, granola bar, and a morning drink with honey, collagen peptides, and longevity mix.</p>
        <h2 style={{ margin: "40px 0 0 40px", fontFamily: "Questrial" }}>This Week:</h2>
        <p style={{ margin: "20px 0 0 40px", fontFamily: "Questrial" }}>Jacob has eaten within his goal of 2,000 calories every day this week. Yesterday he ate 2,050 calories and the day before he has 1,970 calories. He has eaten an average of 124g of protein per day. He has been drinking coffee daily, having a morning drink of collagen peptides, honey, and longevity mix daily, has been having around 15 additional supplements daily, and has been eating a diet consisting of yogurt bowls, nutty pudding, beef sticks, extra virgin olive oil shots, and miscellaneous other foods. He has been having 2tbsp of olive oil per day on average and 10-15g of fiber per day.</p>
        <h2 style={{ margin: "40px 0 0 40px", fontFamily: "Questrial" }}>General Context:</h2>
        <p style={{ margin: "20px 0 0 40px", fontFamily: "Questrial" }}>5’ 11”<br></br>
158lbs<br></br>
Male<br></br>
BMI: 22.04<br></br>
Waist: 31”<br></br>
98.2 degrees Fahrenheit<br></br>
Pulse 59<br></br>
Blood pressure 111/63<br></br>
Jacob's goal is to eat 2,000 calories per day, 130g or protein, and 3tbsp of extra virgin olive oil.</p>
      </div>
    </div>
  );
}