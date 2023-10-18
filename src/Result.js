import React from 'react';

function Result({ typingSpeed }) {
  return (
    <div>
      <h2>Typing Speed Test Result</h2>
      <p>Your typing speed: {typingSpeed} WPM</p>
    </div>
  );
}

export default Result;
