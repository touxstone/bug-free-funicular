'use client'

import { useTheme } from '../contexts/ThemeContext';

export default function SimpleThemeTest() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-4">Simple Theme Test</h3>
      <p className="mb-4">Current theme: <strong>{theme}</strong></p>
      <button
        onClick={toggleTheme}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Toggle Theme
      </button>
    </div>
  );
}