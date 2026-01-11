'use client'

import { useState } from 'react';

type WeatherData = {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🔑 REEMPLAZA con tu API key de OpenWeatherMap
  /* const API_KEY = 'TU_API_KEY_AQUI'; */
  const API_KEY = '3416295f03f382cfdc2a436db3501372';
  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Fetching weather for: ${cityName}`);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found');
        } else if (response.status === 401) {
          throw new Error('Invalid API key - Get yours at openweathermap.org');
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Weather data:', data);
      setWeather(data);
    } catch (err) {
      console.error('❌ Weather error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-xl p-6 text-white max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">Weather App 🌤️</h3>
      
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </form>
      
      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4">Loading weather...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-500 bg-opacity-80 rounded-lg p-4 mb-4">
          <p className="font-semibold">❌ {error}</p>
          {error.includes('API key') && (
            <div className="text-sm mt-2 opacity-90">
              <p>Get a free API key at:</p>
              <a 
                href="https://openweathermap.org/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                openweathermap.org/api
              </a>
            </div>
          )}
        </div>
      )}
      
      {/* Weather Data */}
      {weather && !loading && (
        <div className="space-y-4">
          {/* Location */}
          <div className="text-center">
            <h4 className="text-3xl font-bold">
              {weather.name}, {weather.sys.country}
            </h4>
          </div>
          
          {/* Temperature */}
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">
              {Math.round(weather.main.temp)}°C
            </div>
            <p className="text-xl capitalize">
              {weather.weather[0].description}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto w-24 h-24"
            />
          </div>
          
          {/* Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-20">
            <div className="text-center">
              <p className="text-sm opacity-80">Feels Like</p>
              <p className="text-2xl font-semibold">
                {Math.round(weather.main.feels_like)}°C
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm opacity-80">Humidity</p>
              <p className="text-2xl font-semibold">
                {weather.main.humidity}%
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm opacity-80">Wind Speed</p>
              <p className="text-2xl font-semibold">
                {weather.wind.speed} m/s
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm opacity-80">Condition</p>
              <p className="text-2xl font-semibold">
                {weather.weather[0].main}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Initial State */}
      {!weather && !loading && !error && (
        <div className="text-center py-8 opacity-80">
          <p className="text-lg">🌍 Enter a city name to get weather</p>
          <p className="text-sm mt-2">Try: London, Tokyo, New York, Madrid</p>
        </div>
      )}
    </div>
  );
}