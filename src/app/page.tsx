'use client';

 
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
      <h1 className="freshHeadline">Fresh</h1>
      <button className="button" onClick={goToFoodDetection}>Food Detection →</button><br></br>
      <button className="button" onClick={goToHealthGPT}>Health Coach →</button><br></br>
      <button className="button" onClick={goToWhoopData}>Health Impact →</button><br></br>
    </div>
  );
}

/*       <a href="https://chat.openai.com/" target="_blank" ><button className="button">Health Coach →</button></a><br></br> */ 