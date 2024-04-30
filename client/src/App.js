import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [results, setResults] = useState([]);
  const [requestsSent, setRequestsSent] = useState(0);

  const handleStart = async () => {
    setButtonDisabled(true);

    const concurrencyLimit = parseInt(inputValue);
    const requestsPerSecond = parseInt(inputValue);

    let activeRequests = 0;
    let startTime = new Date().getTime();

    for (let i = 1; i <= 1000; i++) {
      if (requestsSent >= requestsPerSecond) {
        const elapsedTime = new Date().getTime() - startTime;
        const waitTime = Math.max(0, 1000 - elapsedTime);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        startTime = new Date().getTime();
        setRequestsSent(0);
      }

      if (concurrencyLimit === 0 || activeRequests < concurrencyLimit) {
        activeRequests++;
        sendRequest(i, concurrencyLimit)
          .then(() => {
            activeRequests--;
          })
          .catch(() => {
            activeRequests--;
          });
      } else {
        await new Promise(resolve => setTimeout(resolve, 100));
        i--;
      }
    }

    setButtonDisabled(false);
  };

  const sendRequest = async (index) => {
    setRequestsSent(prev => prev + 1);

    const startTime = new Date().getTime();
    return axios.post('http://localhost:3001/api', { index })
      .then(response => {
        const responseIndex = response.data.index;
        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        setResults(prevResults => [...prevResults, { responseIndex, duration }]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleChange = (event) => {
    const newValue = event.target.value;

    if (newValue.startsWith('0')) {
      if (newValue.length > 1) {
        event.preventDefault();
        return;
      }
    }

    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setInputValue(newValue);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleChange} 
        placeholder="Number from 0 to 100" 
      />
      <button onClick={handleStart} disabled={buttonDisabled}>Start</button>
      <ul>
        {results.map(result => (
          <li key={result.responseIndex}>Request {result.responseIndex} took {result.duration}ms</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
