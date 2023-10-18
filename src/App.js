import React, { useState } from 'react';
import './App.css';
import TypingTest from './TypingTest';
import Result from './Result';

function App() {
  const [typingSpeed, setTypingSpeed] = useState(0);

  return (
    <div className="App">
      <TypingTest setTypingSpeed={setTypingSpeed} />
      {typingSpeed > 0 && <Result typingSpeed={typingSpeed} />}
    </div>
  );
}

export default App;
