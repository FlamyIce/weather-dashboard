import React, { useState, useEffect } from 'react';
import './App.css';

const translations = {
  en: {
    title: "Weather Dashboard",
    city: "City",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    temperature: "Temperature",
    description: "Description",
  },
  et: {
    title: "Ilmarakendus",
    city: "Linn",
    theme: "Teema",
    language: "Keel",
    light: "Hele",
    dark: "Tume",
    temperature: "Temperatuur",
    description: "Kirjeldus",
  },
};

const cityCoordinates = {
  Tallinn: { lat: 59.437, lon: 24.7536 },
  Tartu: { lat: 58.3776, lon: 26.729 },
  Parnu: { lat: 58.3859, lon: 24.4971 },
  Narva: { lat: 59.3794, lon: 28.1796 },
};

const weatherDescriptions = {
  0: { en: "Clear sky", et: "Selge ilm" },
  1: { en: "Mainly clear", et: "Peamiselt selge" },
  2: { en: "Partly cloudy", et: "Osaliselt pilves" },
  3: { en: "Overcast", et: "Pilves" },
  45: { en: "Fog", et: "Udu" },
  48: { en: "Depositing rime fog", et: "Härmatisega udu" },
  51: { en: "Light drizzle", et: "Nõrk uduvihm" },
  53: { en: "Moderate drizzle", et: "Mõõdukas uduvihm" },
  55: { en: "Dense drizzle", et: "Tihe uduvihm" },
  61: { en: "Slight rain", et: "Nõrk vihm" },
  63: { en: "Moderate rain", et: "Mõõdukas vihm" },
  65: { en: "Heavy rain", et: "Tugev vihm" },
  71: { en: "Slight snow fall", et: "Nõrk lumesadu" },
  73: { en: "Moderate snow fall", et: "Mõõdukas lumesadu" },
  75: { en: "Heavy snow fall", et: "Tugev lumesadu" },
  80: { en: "Rain showers", et: "Vihmahood" },
  81: { en: "Heavy rain showers", et: "Tugevad vihmahood" },
  82: { en: "Violent rain showers", et: "Ägedad vihmahood" },
  95: { en: "Thunderstorm", et: "Äikestorm" },
  96: { en: "Thunderstorm with hail", et: "Äike rahega" },
  99: { en: "Thunderstorm with heavy hail", et: "Äike tugeva rahega" },
};

function App() {
  const [city, setCity] = useState('Tallinn');
  const [weather, setWeather] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    const coords = cityCoordinates[city];
    if (!coords) return;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;

    fetch(url)
      .then(res => res.json())
      .then(data => setWeather(data.current_weather));
  }, [city]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = translations[language];

  const getWeatherDescription = (code) => {
    return weatherDescriptions[code]?.[language] || code;
  };

  return (
    <div className="App">
      <h1>{t.title}</h1>

      <label>{t.city}: </label>
      <select value={city} onChange={e => setCity(e.target.value)}>
        {Object.keys(cityCoordinates).map(cityName => (
          <option key={cityName} value={cityName}>{cityName}</option>
        ))}
      </select>

      <div>
        <label>{t.theme}: </label>
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="light">{t.light}</option>
          <option value="dark">{t.dark}</option>
        </select>
      </div>

      <div>
        <label>{t.language}: </label>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="et">Eesti</option>
        </select>
      </div>

      {weather ? (
        <div>
          <h2>{city}</h2>
          <p>{t.temperature}: {weather.temperature}°C</p>
          <p>{t.description}: {getWeatherDescription(weather.weathercode)}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
