'use client'

import { useState } from 'react';

export default function NameInput() {
  const [name, setName] = useState('');
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Controlled Input</h3>
      
      {/* Input controlado */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      
      {/* Mostrar el valor en tiempo real */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">
          {name ? (
            <>You typed: <strong>{name}</strong></>
          ) : (
            <em className="text-gray-500">Start typing...</em>
          )}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Characters: {name.length}
        </p>
      </div>
    </div>
  );
}