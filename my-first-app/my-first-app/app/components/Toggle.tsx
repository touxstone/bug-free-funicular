'use client'

import { useState } from 'react';

export default function Toggle() {
  // Estado: true = mostrar, false = ocultar
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Toggle Content</h3>
      
      {/* Botón que cambia el estado */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 mb-4"
      >
        {isVisible ? 'Hide' : 'Show'} Content
      </button>
      
      {/* Contenido condicional */}
      {isVisible && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-gray-700">
            🎉 This content is visible because isVisible = true!
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Click the button to hide me again.
          </p>
        </div>
      )}
    </div>
  );
}