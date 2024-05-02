'use client';
 
import React, { useState, useEffect } from 'react';
 
export default function WhoopData() {

  return (
    <div className="whoopMain">
      <div className="whoopMainTop">
        <h2>Tracks Health Impact of Food</h2>
        <p>Tracks how food impacts your HRV, RHR, sleep metrics, and additional metrics via Whoop, 8 sleep, or glucose monitors if connected</p>
      </div>
      <div className="insights">
        <h2>Insights</h2><br></br>
        <ul>
            <div className="red">
                <p>High Impact</p>
            </div>
            <li>Sleep quality is decreased on days you drank coffee</li><br></br>
            <div className="yellow">
                <p>Medium Impact</p>
            </div>
            <li>Eating rice increases resting heart rate and lowers hrv</li><br></br>
            <div className="green">
                <p>Low Impact</p>
            </div>
            <li>Not eating for 4 hours before bed resulted in higher quality sleep</li><br></br>
        </ul>
      </div>
      <div className="protocols">
        <h2>Protocols</h2>
        <p>Vibe builds you diet, workout, and sleep protocols and improves them over time</p><br></br>
        <ul>
            <li>Nutrition Protocol</li><br></br>
            <li>Fitness Protocol</li><br></br>
            <li>Sleep Protocol</li><br></br>
        </ul>
      </div>
    </div>
  );
}

/*       <p>Sleep performance, sleep consistency, sleep efficiency</p>
      <p>Recovery, resting heart rate, hrv, skin temp</p>
      <p>Workout performance metrics such as strain and max heart rate</p><br></br> */