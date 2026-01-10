// app/useTimer.ts
import { useState, useEffect } from 'react';

export function useTimer(initialSeconds: number = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => { if (interval) window.clearInterval(interval); };
  }, [isActive]);

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const toggle = () => setIsActive(!isActive);

  // Devolvemos solo lo que el componente necesita usar
  return { seconds, setSeconds, isActive, toggle, reset };
}