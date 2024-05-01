'use client';

 
export default function Chat() {

  const goToFoodDetection = () => {
    window.location.href = '/fooddetection';
  }

  return (
    <div className="main">
      <h1>Vibe</h1>
      <button className="button" onClick={goToFoodDetection}>Food Detection →</button>
    </div>
  );
}