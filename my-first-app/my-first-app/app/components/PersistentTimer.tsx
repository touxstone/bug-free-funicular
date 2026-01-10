'use client'

import { useState, useEffect } from 'react';

export default function PersistentTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. EFECTO DE CARGA (Al montar el componente)
  useEffect(() => {
    setIsMounted(true);  
    const savedSeconds = localStorage.getItem('timer-value');
    if (savedSeconds) {
      setSeconds(parseInt(savedSeconds));
    }
    console.log("Datos cargados desde el almacenamiento local");
  }, []); // Array vacío = solo una vez

  // 2. EFECTO DE GUARDADO (Cada vez que 'seconds' cambie)
  useEffect(() => {
    if (isMounted && seconds > 0) { 
      localStorage.setItem('timer-value', seconds.toString());
    }
  }, [seconds, isMounted]); // Se ejecuta cada vez que el contador sube

  // 3. EFECTO DEL CRONÓMETRO (El que ya teníamos)
  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive]);

    if(!isMounted){return<div className='p-6'> Cargando temporizador...</div>;  }


  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-2">Temporizador Persistente</h2>
      <p className="text-gray-500 mb-4 text-sm">Refresca la página y verás que no se pierde el tiempo.</p>
      
      <div className="text-5xl font-mono text-blue-600 mb-6">{seconds}s</div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-2 rounded-lg font-semibold text-white transition ${isActive ? 'bg-orange-500' : 'bg-blue-500'}`}
        >
          {isActive ? 'Pausar' : 'Iniciar'}
        </button>
        
        <button 
          onClick={() => {
            setSeconds(0);
            localStorage.removeItem('timer-value');
          }}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}