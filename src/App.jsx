import React, { useState, useEffect } from "react";
import WeatherApp from './components/weather'
import Preloader from "./components/loader";
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    
    setTimeout(() => {
      setIsLoading(false); 
    }, 1000);
  }, []);
  return (
    <>
    <div>
        {isLoading ? (
          <Preloader />
        ) : (
          <div>
            <WeatherApp />
          </div>
        )}
      </div>
    
     </>
  )
}

export default App
