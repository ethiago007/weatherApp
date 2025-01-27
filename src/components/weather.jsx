import React, { useState, useEffect } from "react";
import { hourglass, reuleaux } from "ldrs";
import { Typography, TextField, Button, Stack } from "@mui/material";
import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  CloudLightning,
  CloudFog,
  Cloudy,
  TriangleAlert,
  ThermometerSun,
  Droplet,
} from "lucide-react";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backgroundStyle, setBackgroundStyle] = useState({
    background: "linear-gradient(to top, #87CEEB, #FFFFFF)", 
  });

  reuleaux.register();

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun size={80} color="#FFCC00" />;
      case "clear":
      case "partly cloudy":
        return <Cloudy size={80} color="white" />;
      case "mist":
      case "fog":
        return <CloudFog size={80} color="grey" />;
      case "lightning":
      case "thunder":
      case "thunderstorm":
        return <CloudLightning size={80} color="yellow" />;
      case "cloudy":
        return <Cloud size={80} color="#B0B0B0" />;
      case "rain":
      case "drizzle":
        case "patchy rain nearby":
        return <CloudRain size={80} color="#0077B6" />;
      case "snow":
        return <Snowflake size={80} color="#A9A9A9" />;
      case "wind":
        return <Wind size={80} color="#00A3E0" />;
      default:
        return <Sun size={80} color="#FFCC00" />;
    }
  };

  const getBackgroundGradient = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return {
          background: "linear-gradient(to top, #FFD700, #FFEC8B)", 
        };
      case "clear":
      case "partly cloudy":
        return {
          background: "linear-gradient(to top, #87CEEB, #FFFFFF)", 
        };
      case "mist":
      case "fog":
        return {
          background: "linear-gradient(to top, #D3D3D3, #FFFFFF)", 
        };
      case "lightning":
      case "thunder":
      case "thunderstorm":
        return {
          background: "linear-gradient(to top, #708090, #3B3B3B)", 
        };
      case "cloudy":
        return {
          background: "linear-gradient(to top, #B0C4DE, #E6E6FA)", 
        };
      case "rain":
      case "drizzle":
        case "patchy rain nearby":
        return {
          background: "linear-gradient(to top, #4682B4, #A9D0F5)", 
        };
      case "snow":
        return {
          background: "linear-gradient(to top, #F0F8FF, #E0FFFF)", 
        };
      case "wind":
        return {
          background: "linear-gradient(to top, #A2D9CE, #E8F8F5)", 
        };
      default:
        return {
          background: "linear-gradient(to top, #FFD700, #FFEC8B)", 
        };
    }
  };

  const fetchWeatherData = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}&lang=en`
      );
      if (!response.ok) {
        throw new Error("City not found or invalid request!");
      }
      const data = await response.json();
      setWeatherData(data);

      
      const gradient = getBackgroundGradient(data.current.condition.text);
      setBackgroundStyle(gradient);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    Object.assign(document.body.style, backgroundStyle);

    return () => {
      
      document.body.style.background = null;
    };
  }, [backgroundStyle]);

  useEffect(() => {
    const requestLocation = async () => {
      if ("geolocation" in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: "geolocation" });
          
          if (permission.state === "granted" || permission.state === "prompt") {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(`${latitude},${longitude}`);
              },
              (error) => {
                setError("Unable to retrieve location. Please search for a city.");
              }
            );
          } else {
            setError("Location access denied. Please search for a city.");
          }
        } catch (err) {
          setError("Unable to check location permission. Please search for a city.");
        }
      } else {
        setError("Geolocation is not supported by your browser.");
      }
    };
  
    requestLocation();
  }, []);
  

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() === "") {
      setError("Please enter a city name!");
      return;
    }
    fetchWeatherData(city);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <form onSubmit={handleSearch}>
        <TextField
          label="Enter City Name..."
          variant="outlined"
          sx={{
            width: { md: "800px", sm: "550px", xs: "280px" },
            mt: 10,
            mb: 3,
            backgroundColor: "white",
            borderRadius: "7px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
          }}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ margintop: 8 }}
        >
          {loading ? (
            <l-reuleaux
              size="30"
              bg-opacity="0.1"
              speed="1.75"
              color="white"
            ></l-reuleaux>
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {error && (
        <p style={{ color: "red", margintop: 6 }}>
          <TriangleAlert color="#d01616" /> {error}
        </p>
      )}
<br />
      {weatherData && (
        <div style={{ textAlign: "center" }}>
          {getWeatherIcon(weatherData.current.condition.text)}
          <Typography
            sx={{
              fontSize: { md: "52px", sm: "50px", xs: "40px" },
              fontWeight: 500,
            }}
          >
            {weatherData.current.temp_c}°C
          </Typography>
          <Typography sx={{ fontSize: "20px", mb: 4 }}>
            {weatherData.current.condition.text}
          </Typography>
          <Typography sx={{ fontSize: "20px", mb: 5 }}>
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </Typography>
          <Stack
            direction="row"
            spacing={4}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            <Stack
              direction="column"
              spacing={2}
              sx={{ alignItems: "center" }}
            >
              <Wind size={50} />
              <Typography>{weatherData.current.wind_kph} kph</Typography>
              <Typography>Wind</Typography>
            </Stack>
            <Stack
              direction="column"
              spacing={2}
              sx={{ alignItems: "center" }}
            >
              <Droplet size={50} />
              <Typography>{weatherData.current.humidity}%</Typography>
              <Typography>Humidity</Typography>
            </Stack>
            <Stack
              direction="column"
              spacing={2}
              sx={{ alignItems: "center" }}
            >
              <ThermometerSun size={50} />
              <Typography>{weatherData.current.feelslike_c}°C</Typography>
              <Typography>Feels Like</Typography>
            </Stack>
          </Stack>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
