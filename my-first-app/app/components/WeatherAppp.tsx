'use client'

import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

type WeatherData = {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
}

export default function WeatherApp() {
  const [inputValue, setInputValue] = useState('');
  const [url, setUrl] = useState('');
  
  const API_KEY = '3416295f03f382cfdc2a436db3501372';

  // El hook ahora maneja TODO el estado de la petición
  const { data: weather, loading, error } = useFetch<WeatherData>(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Al actualizar el estado 'url', el useEffect dentro de useFetch se dispara automáticamente
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue.trim()}&units=metric&appid=${API_KEY}`;
    setUrl(apiUrl);
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-xl p-6 text-white max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">Weather Appp 🌤️</h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
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
        </div>
      )}
      
      {/* Weather Data */}
      {weather && !loading && (
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-3xl font-bold">{weather.name}, {weather.sys.country}</h4>
          </div>
          
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{Math.round(weather.main.temp)}°C</div>
            <p className="text-xl capitalize">{weather.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto w-24 h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-20">
            <div className="text-center">
              <p className="text-sm opacity-80">Feels Like</p>
              <p className="text-2xl font-semibold">{Math.round(weather.main.feels_like)}°C</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-80">Humidity</p>
              <p className="text-2xl font-semibold">{weather.main.humidity}%</p>
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
          <p className="text-sm mt-2">Try: tu barrio, my barrio, etc.. ~~`</p>
        </div>
      )}
    </div>
  );
}