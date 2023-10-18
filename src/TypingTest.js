import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TypingTest() {
  const [textToType, setTextToType] = useState('');
  const [userInput, setUserInput] = useState('');
  const [coloredInput, setColoredInput] = useState([]);
  const [time, setTime] = useState(60);
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
    const interval = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
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

  return (
    <div>
      <p>{coloredInput.length ? coloredInput : textToType}</p>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        style={{ width: '100%' }}
      />
      <p>Time: {time} seconds</p>
      <p>Typing Speed: {wpm} WPM</p>
      <p>Accuracy: {accuracy} %</p>
    </div>
  );
}

export default TypingTest;
