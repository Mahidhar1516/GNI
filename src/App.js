import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import splashscreen from './Components/splashscreen';

function App() {
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500); // 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <splashscreen />;
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
