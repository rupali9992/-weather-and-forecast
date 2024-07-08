import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faDroplet,
  faSun,
  faCloud,
  faCloudSun,
  faCloudRain,
  faBolt,
  faSnowflake,
  faSmog,
  faWind,
  faCloudBolt,
  faCloudSunRain,
  faCloudShowersHeavy,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faSun,
  faCloud,
  faCloudSun,
  faCloudRain,
  faBolt,
  faSnowflake,
  faSmog,
  faWind,
  faDroplet,
  faCloud,
  faCloudBolt,
  faCloudSunRain,
  faCloudShowersHeavy
);
const weatherIcons = {
  "clear sky": "sun",
  "few clouds": "cloud-sun",
  "scattered clouds": "cloud-bolt",
  "broken clouds": "cloud-bolt",
  "overcast clouds": "cloud-sun-rain",
  "light rain": "cloud-rain",
  "moderate rain": "cloud-rain",
  "heavy rain": "cloud-showers-heavy",
};

export default function CheckWeather() {
  const { cityId } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=1a986f69ba609f66d0f4f676cb8b807f`;
    const apiForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=1a986f69ba609f66d0f4f676cb8b807f`;
    console.log(apiForecastUrl);
  
    Promise.all([fetch(apiUrl), fetch(apiForecastUrl)])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then(([weatherData, forecastData]) => {
        setWeatherData({ weather: weatherData, forecast: forecastData });
        console.log(forecastData);
        console.log(weatherData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [cityId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p>Loading weather data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!weatherData) {
    return <p>No weather data available</p>;
  }
  const kelvinTemp = weatherData.weather.main.temp;

  const celsiusTemp = kelvinTemp - 273.15;
  const fahrenheitTemp = (kelvinTemp - 273.15) * (9 / 5) + 32;

  const kelvinToFahrenheit = (kelvin) =>
    (((kelvin - 273.15) * 9) / 5 + 32).toFixed(2);

  const unixToLocalDateString = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString();
  };

 const getWeatherIcon = (description) => {
   const icon = weatherIcons[description.toLowerCase()];
   return icon ? <FontAwesomeIcon icon={icon} /> : null;
 };
  return (
    <div className="weather-page relative">
      <video
        autoPlay
        loop
        muted
        className="background-video absolute inset-0 w-full h-full object-cover"
      >
        <source src="/3130376-uhd_3840_2160_24fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 p-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1  p-6 rounded-lg shadow-md weather-data">
          <h1 className="text-xl font-bold mb-4 text-center">
            Current Weather for {weatherData.weather.name}, (
            {weatherData.weather.sys.country})
          </h1>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">
              {weatherData.weather.name}, {weatherData.weather.sys.country}
            </h2>
            <div className="text-sm font-bold mb-4">
              {currentDate.toLocaleDateString()}
            </div>
            <img
              className="cloud-icon mb-4"
              src="/CloudyV3.svg"
              alt="Cloudy icon"
            />

            <div className="text-4xl font-medium mb-6">
              {celsiusTemp.toFixed(0)}°C
              <br />
              {fahrenheitTemp.toFixed(0)}°F
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm"> Wind speed</div>
                <FontAwesomeIcon className="p-5" icon="fa-solid fa-wind" />
                <div className="text-sm ">
                  {" "}
                  {weatherData.weather.wind.speed} m/s
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm">Humidity</div>
                <FontAwesomeIcon className="p-5" icon="fa-solid fa-droplet" />
                <div className="text-sm ">
                  {weatherData.weather.main.humidity}%
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm">Pressure</div>
                <FontAwesomeIcon className="p-5" icon="fa-solid fa-cloud" />
                <div className="text-sm ">
                  {weatherData.weather.main.pressure} Mb
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="flex flex-col items-center weather-description">
            <span>
              {" "}
              {getWeatherIcon(weatherData.weather.weather[0].description)}
            </span>
            <p> {weatherData.weather.weather[0].description}</p>
          </div>
        </div>

        <div className="col-span-3  rounded-lg shadow-md  ">
          <p className="forecast-heading font-bold">6 DAY FORECAST</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 forecast-data ">
            {weatherData.forecast.list.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow forecast-col"
              >
                <div className="font-bold text-lg mb-2">
                  Date: {unixToLocalDateString(item.dt)}
                  <br />
                  Time: {item.dt_txt.split(" ")[1]}
                </div>
                <div className="flex justify-between mb-2">
                  <div className="text-sm">Temp:</div>
                  <div className="font-semibold">
                    {item.main.temp} K ({kelvinToFahrenheit(item.main.temp)}°F)
                  </div>
                </div>
                <div className="text-sm mb-2 font-awesome-icon">
                  {getWeatherIcon(item.weather[0].description)}
                </div>
                <div className="flex justify-between">
                  <div className="text-sm">Humidity:</div>
                  <div className="font-semibold">{item.main.humidity}%</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm">Pressure:</div>
                  <div className="font-semibold">{item.main.pressure} hPa</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
