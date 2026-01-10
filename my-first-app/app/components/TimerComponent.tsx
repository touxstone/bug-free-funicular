'use client'

import { useState, useEffect } from 'react';

export default function TimerComponent() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      // 1. Iniciamos un proceso (Efecto)
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        console.log("Intervalo corriendo...");
      }, 1000);
    }

    // 2. FUNCIÓN DE LIMPIEZA (Cleanup)
    // React ejecuta esto antes de volver a correr el efecto o al destruir el componente
    return () => {
      console.log("Limpiando intervalo anterior...");
      if (interval){ 
      clearInterval(interval);}
    };

  }, [isActive]); // 3. ARRAY DE DEPENDENCIAS: El efecto solo se reinicia si isActive cambia

  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Temporizador Inteligente</h2>
      <p className="text-4xl font-mono mb-4">{seconds}s</p>
      
      <button 
        onClick={() => setIsActive(!isActive)}
        className={`px-4 py-2 rounded text-white ${isActive ? 'bg-red-500' : 'bg-green-500'}`}
      >
        {isActive ? 'Pausar' : 'Reanudar'}
      </button>
    </div>
  );
}