'use client'

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para saber si ya montamos en el cliente
  const [isMounted, setIsMounted] = useState(false);
  
  // State para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // Detectar cuando estamos en el cliente
  useEffect(() => {
    setIsMounted(true);
    
    // Cargar del localStorage
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, [key]);
  
  // Función para actualizar el valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que value sea una función como en useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar en state
      setStoredValue(valueToStore);
      
      // Guardar en localStorage (solo en cliente)
      if (isMounted && typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  return [storedValue, setValue] as const;
}