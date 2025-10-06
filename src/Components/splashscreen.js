// src/components/SplashScreen.jsx
import React from "react";
import "./SplashScreen.css";

export default function SplashScreen() {
  return (
    <div className="splash-container">
      <div className="splash-logo">
        <img
          src="/gnilogo.png"
          alt="App Logo"
          className="splash-image"
        />
        <h1 className="splash-title">Welcome to GNI</h1>
      </div>
    </div>
  );
}
