'use client'

import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset state cuando cambia la URL
    setLoading(true);
    setError(null);
    
    const fetchData = async () => {
      try {
        console.log(`🔄 Fetching: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        
        console.log(`✅ Fetched data:`, json);
        setData(json);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        console.error(`❌ Fetch error:`, errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]); // Re-fetch cuando cambia la URL
  
  return { data, loading, error };
}