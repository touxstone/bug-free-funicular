'use client'

import { useState, useEffect, useRef } from 'react';

export default function RenderCounter() {
  const [count, setCount] = useState(0);
  //const [renderCount, setRenderCount] = useState(0);
  
  // useEffect que corre en CADA render
  //useEffect(() => {
  //  setRenderCount(renderCount + 1);
  //}); // Sin dependencias = corre siempre
  const [isMounted, setIsMounted] = useState(false); 
  const renderCount = useRef(0); 
// Incrementar el contador de renders en cada renderizado  
  renderCount.current = renderCount.current + 1;
// useEffect que corre SOLO en el primer render  
  useEffect(() => {
  setIsMounted(true);
  }, []); 

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Render Counter</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded">
          <p className="text-sm text-gray-600">Button clicks:</p>
          <p className="text-3xl font-bold text-blue-600">{count}</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded">
          <p className="text-sm text-gray-600">Component renders:</p>
          <p className="text-3xl font-bold text-purple-600">{isMounted ? renderCount.current : 0}</p>
        </div>
        
        <button
          onClick={() => setCount(count + 1)}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Increment Count
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        Notice: Clicking the button causes a re-render
      </p>
    </div>
  );
}