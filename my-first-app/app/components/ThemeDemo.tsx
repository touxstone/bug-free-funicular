'use client'

import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function ThemeDemo() {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  
  return (
    <div 
      className="rounded-lg shadow-xl p-8 max-w-2xl mx-auto transition-all duration-300"
      style={{
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#1f2937',
      }}
    >
      <h3 className="text-3xl font-bold mb-6 text-center">
        Theme Context Demo 🎨
      </h3>
      
      <div className="space-y-6">
        {/* Current Theme Display */}
        <div 
          className="p-6 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: isDark ? '#374151' : '#f3f4f6',
          }}
        >
          <p className="text-lg font-semibold mb-2">Current Theme:</p>
          <p className="text-4xl font-bold">
            {isDark ? '🌙 Dark' : '☀️ Light'}
          </p>
        </div>
        
        {/* Theme Toggle Button */}
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
        
        {/* Sample Content Card */}
        <div 
          className="p-6 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
          }}
        >
          <h4 className="text-xl font-bold mb-3">Sample Content</h4>
          <p className="mb-3">
            This entire section changes based on the global theme context.
            The theme is stored in localStorage and persists across page reloads.
          </p>
          <p className="text-sm opacity-80">
            Notice how multiple components access the same theme state without
            passing props through every level!
          </p>
        </div>
        
        {/* Feature List */}
        <div 
          className="p-6 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: isDark ? '#065f46' : '#d1fae5',
          }}
        >
          <p className="font-semibold mb-3">💡 Context API Benefits:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>No prop drilling - access state from anywhere</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Automatic re-renders when context changes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Persisted in localStorage automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Clean and maintainable code</span>
            </li>
          </ul>
        </div>
        
        {/* Technical Info */}
        <div 
          className="p-4 rounded-lg text-xs transition-colors duration-300"
          style={{
            backgroundColor: isDark ? '#312e81' : '#e0e7ff',
          }}
        >
          <p className="font-semibold mb-2">🔧 How it works:</p>
          <ol className="space-y-1 list-decimal list-inside opacity-90">
            <li>ThemeProvider wraps entire app in layout.tsx</li>
            <li>Any component can use useTheme() hook</li>
            <li>Changing theme updates all consumers instantly</li>
            <li>Theme saved to localStorage on every change</li>
          </ol>
        </div>
      </div>
    </div>
  );
}