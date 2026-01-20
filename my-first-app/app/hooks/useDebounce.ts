'use client'

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // Set timeout para actualizar después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Cleanup: cancelar timeout si value cambia antes del delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}