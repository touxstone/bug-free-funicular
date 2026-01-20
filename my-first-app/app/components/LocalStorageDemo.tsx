'use client'

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function LocalStorageDemo() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Usar el custom hook
  const [name, setName] = useLocalStorage('username', '');
  const [age, setAge] = useLocalStorage('age', 0);
  const [preferences, setPreferences] = useLocalStorage('prefs', {
    theme: 'light',
    notifications: true,
  });
  
  // Detectar cuando estamos en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Mostrar loading mientras se monta
  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6">useLocalStorage Hook 💾</h3>
      
      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (saved in localStorage)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        
        {/* Age Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age (saved in localStorage)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your age"
          />
        </div>
        
        {/* Theme Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferences
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setPreferences({
                ...preferences,
                theme: preferences.theme === 'light' ? 'dark' : 'light'
              })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Theme: {preferences.theme === 'light' ? '☀️ Light' : '🌙 Dark'}
            </button>
            
            <button
              onClick={() => setPreferences({
                ...preferences,
                notifications: !preferences.notifications
              })}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Notifications: {preferences.notifications ? '🔔 On' : '🔕 Off'}
            </button>
          </div>
        </div>
        
        {/* Display Current Values */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-800 mb-2">Current Values:</p>
          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{JSON.stringify({ name, age, preferences }, null, 2)}
          </pre>
        </div>
        
        {/* Clear All */}
        <button
          onClick={() => {
            setName('');
            setAge(0);
            setPreferences({ theme: 'light', notifications: true });
          }}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear All Data
        </button>
      </div>
      
      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
        <p className="font-semibold text-blue-800 mb-2">💡 Try this:</p>
        <ul className="space-y-1 text-xs text-blue-700">
          <li>• Change values and refresh page → data persists!</li>
          <li>• Open DevTools → Application → Local Storage</li>
          <li>• See username, age, prefs stored</li>
          <li>• Same API as useState but with persistence</li>
        </ul>
      </div>
    </div>
  );
}