'use client'

import { useEffect, useState } from 'react';
import { useTimer } from './useTimer'; // Importamos nuestro hook

export default function PersistentTimer() {
  const { seconds, setSeconds, isActive, toggle, reset } = useTimer();
  const [isMounted, setIsMounted] = useState(false);

  // Solo nos queda la lógica de persistencia (LocalStorage)
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('timer-value');
    if (saved) setSeconds(parseInt(saved));
  }, [setSeconds]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('timer-value', seconds.toString());
  }, [seconds, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-2 text-gray-700">Custom Hook Timer</h2>
      <div className="text-5xl font-mono text-green-600 mb-6">{seconds}s</div>
      
      <div className="flex gap-2">
        <button onClick={toggle} className="px-6 py-2 rounded-lg bg-green-500 text-white font-bold">
          {isActive ? 'Pausar' : 'Iniciar'}
        </button>
        <button onClick={() => { reset(); localStorage.removeItem('timer-value'); }} 
                className="px-6 py-2 bg-gray-100 rounded-lg">
          Reiniciar
        </button>
      </div>
    </div>
  );
}