import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TypingTest() {
  const [textToType, setTextToType] = useState('');
  const [userInput, setUserInput] = useState('');
  const [coloredInput, setColoredInput] = useState([]);
  const [time, setTime] = useState(0);
  const [wpm, setWpm] = useState();
  const [accuracy, setAccuracy] = useState();
  const fetchRandomText = async () => {
    try {
      const response = await axios.get(
        'https://baconipsum.com/api/?type=easy&paras=2'
      );
      debugger;
      const paragraph = response.data
        .map((sentence, index) => (index === 0 ? sentence : ' ' + sentence)) // Add spaces between sentences
        .join('');
      setTextToType(paragraph);
    } catch (error) {
      console.error('Error fetching text:', error);
    }
  };
  function calculateTypingAccuracy(expectedText, userInput) {
    const expectedLength = expectedText.length;
    const userInputLength = userInput.length;

    let matchingCharacters = 0;
    for (let i = 0; i < Math.min(expectedLength, userInputLength); i++) {
      if (expectedText[i] === userInput[i]) {
        matchingCharacters++;
      }
    }

    const accuracyData = (matchingCharacters / expectedLength) * 100;
    setAccuracy(accuracyData);
  }
  useEffect(() => {
    if (userInput) {
      const interval = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [userInput]);
  useEffect(() => {
    if (time === 0) {
      calculateTypingAccuracy(textToType, userInput);
      setWpm(Math.round(userInput.length / (120 / 60)));
    }
  }, [time]);
  useEffect(() => {
    fetchRandomText();
  }, []);
  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setUserInput(inputText);

    // Compare each character in the input with the expected text and apply color accordingly
    const coloredCharacters = textToType.split('').map((char, index) => {
      let color = 'black'; // Default color is black

      if (index < inputText.length) {
        // Check if the character is correct or incorrect
        color = inputText[index] === char ? 'green' : 'red';
      }

      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });

    setColoredInput(coloredCharacters);
  };
  const handleChange = (e) => {
    setTime(parseInt(e.target.value));
  };

  return (
    <div>
      <div class="container">
        <select onChange={handleChange}>
          <option>select time</option>
          <option value={60}>1 minutes</option>
          <option value={120}>2 minutes</option>
          <option value={180}>3 minutes</option>
          <option value={300}>5 minutes</option>
          <option value={600}>10 minutes</option>
        </select>
        <main>
          <div class="typing-container">
            <p id="text-to-type">Type the text below:</p>
            <p style={{ width: '700px' }}>
              {coloredInput.length ? coloredInput : textToType}
            </p>
            <textarea
              id="user-input"
              rows="5"
              cols="40"
              value={userInput}
              onChange={handleInputChange}
              disabled={time === 0}
              placeholder="Start typing here..."
            ></textarea>
          </div>
          <div class="result-container">
            <p>Time: {time} seconds</p>
            <p>Accuracy: {accuracy || 0} %</p>
            <p id="result">
              Words per minute: <span id="wpm">{wpm || 0}</span>
            </p>
          </div>
        </main>
        <footer>
          <p>&copy; 2023 Nikunj</p>
        </footer>
      </div>
      <script src="script.js"></script>
    </div>
  );
}

export default TypingTest;
