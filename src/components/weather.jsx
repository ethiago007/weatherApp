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
  reuleaux.register();

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun size={80} color="#FFCC00" />;
      case "clear":
        return <Cloudy size={80} color="white" />;
      case "mist":
        return <CloudFog size={80} color="grey" />;
      case "lightning":
        return <CloudLightning size={80} color="yellow" />;
      case "cloudy":
        return <Cloud size={80} color="#B0B0B0" />;
      case "rainy":
      case "drizzle":
      case "light drizzle":
        return <CloudRain size={80} color="#0077B6" />;
      case "snow":
        return <Snowflake size={80} color="#A9A9A9" />;
      case "windy":
        return <Wind size={80} color="#00A3E0" />;
      default:
        return <Sun size={80} color="#FFCC00" />;
    }
  };

  const fetchWeatherData = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=2632be236b694166ab6182917250501&q=${query}&lang=en`
      );
      if (!response.ok) {
        throw new Error("City not found or invalid request!");
      }
      const data = await response.json();
      setWeatherData(data);
      setCity(data.location.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocationWeather = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(`${latitude},${longitude}`);
        },
        (err) => {
          setError("Unable to get your location. Please search for a city.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    fetchCurrentLocationWeather();
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
    <div>
      <form onSubmit={handleSearch}>
        <TextField
          label="Enter City Name..."
          id="outlined-basic"
          variant="outlined"
          sx={{
            width: { md: "800px", sm: "550px", xs: "280px" },
            mt: 10,
            mb: 3,
            backgroundColor: "white",
            borderRadius: "7px",
            color: "black",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
          }}
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ marginBottom: 8 }}
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
        <p style={{ color: "red", marginBottom: 6 }}>
          {" "}
          <TriangleAlert color="#d01616" /> {error}
        </p>
      )}

      {weatherData && (
        <div style={{ textAlign: "center" }}>
          {getWeatherIcon(weatherData.current.condition.text)}

          <p>
            <Typography
              sx={{
                fontSize: { md: "52px", sm: "50px", xs: "40px" },
                fontWeight: 500,
              }}
            >
              {weatherData.current.temp_c}°C
            </Typography>
          </p>
          <p>
            <Typography sx={{ fontSize: "20px", mb: 4 }}>
              {weatherData.current.condition.text}
            </Typography>
          </p>
          <p>
            <Typography sx={{ fontSize: "20px", mb:5 }}>
              {weatherData.location.name} {weatherData.location.region} ,{" "}
              {weatherData.location.country}
            </Typography>
          </p>
          <Stack
            direction="row"
            spacing={4}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            <Stack direction="column" spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
              <Wind size={50} />
              <Typography> {weatherData.current.wind_kph} kph </Typography>
              <Typography> Wind </Typography>
              
            </Stack>
            <Stack direction="column" spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
              <Droplet size={50} />
              <Typography> {weatherData.current.humidity}% </Typography>
              <Typography> Humidity </Typography>
            </Stack>
            <Stack direction="column" spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
              <ThermometerSun size={50} />
              <Typography> {weatherData.current.heatindex_c}°C </Typography>
              <Typography> Heat Index </Typography>
            </Stack>
          </Stack>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
