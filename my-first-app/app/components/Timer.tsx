'use client'

import { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      // Crear interval que incrementa cada segundo
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    
    // 🔑 CLEANUP: limpiar el interval cuando:
    // - El componente se desmonte
    // - isRunning cambie (antes de re-ejecutar el effect)
    return () => {
      if (interval) {
        clearInterval(interval);
        console.log('⚠️ Cleanup: Interval cleared');
      }
    };
  }, [isRunning]); // Solo re-ejecuta cuando isRunning cambia
  
  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };
  
  // Formatear segundos a MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-center">Timer ⏱️</h3>
      
      {/* Display del tiempo */}
      <div className="text-6xl font-bold text-center mb-6 text-blue-600 font-mono">
        {formatTime(seconds)}
      </div>
      
      {/* Botones de control */}
      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
          >
            Stop
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
        >
          Reset
        </button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Status: {isRunning ? '🟢 Running' : '⏸️ Stopped'}
      </div>
      
      {/* Info explicativa */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p className="font-semibold mb-1">💡 useEffect with Cleanup:</p>
        <p>Open console (F12) to see cleanup messages when stopping.</p>
      </div>
    </div>
  );
}