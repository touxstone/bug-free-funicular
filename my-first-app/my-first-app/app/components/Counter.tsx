'use client'

import { useState } from 'react';

export default function Counter() {
  // useState: hook para crear estado
  // count: variable de estado (valor actual)
  // setCount: función para cambiar el estado
  const [count, setCount] = useState(0);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 className="text-xl font-bold mb-4">Counter</h3>
      
      {/* Mostrar el valor actual */}
      <p className="text-5xl font-bold text-blue-600 mb-6">
        {count}
      </p>
      
      {/* Botones para cambiar el estado */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setCount(count - 1)}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          -1
        </button>
        
        <button
          onClick={() => setCount(0)}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Reset
        </button>
        
        <button
          onClick={() => setCount(count + 1)}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          +1
        </button>
      </div>
    </div>
  );
}