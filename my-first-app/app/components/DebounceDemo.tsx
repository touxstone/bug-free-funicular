'use client'

import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export default function DebounceDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // Simular resultados de búsqueda
  const allItems = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS',
    'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Prisma',
    'Vue.js', 'Angular', 'Svelte', 'Redux', 'Zustand'
  ];
  
  const filteredItems = allItems.filter(item =>
    item.toLowerCase().includes(debouncedSearch.toLowerCase())
  );
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6">useDebounce Hook ⏱️</h3>
      
      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Technologies:
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type to search..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Search delayed by 500ms (debounced)
        </p>
      </div>
      
      {/* Current vs Debounced Values */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm space-y-1">
        <p>
          <span className="font-semibold">Immediate value:</span>{' '}
          <code className="bg-gray-200 px-2 py-1 rounded">
            "{searchTerm}"
          </code>
        </p>
        <p>
          <span className="font-semibold">Debounced value:</span>{' '}
          <code className="bg-blue-100 px-2 py-1 rounded">
            "{debouncedSearch}"
          </code>
        </p>
      </div>
      
      {/* Results */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Results ({filteredItems.length}):
        </p>
        {filteredItems.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredItems.map(item => (
              <div
                key={item}
                className="px-4 py-2 bg-blue-50 rounded-lg text-sm text-gray-800 border border-blue-200"
              >
                {item}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic py-4 text-center">
            No results found
          </p>
        )}
      </div>
      
      {/* Info */}
      <div className="mt-6 p-4 bg-orange-50 rounded-lg text-sm">
        <p className="font-semibold text-orange-800 mb-2">💡 Why Debounce?</p>
        <ul className="space-y-1 text-xs text-orange-700">
          <li>• Prevents excessive API calls while typing</li>
          <li>• Waits until user stops typing</li>
          <li>• Improves performance significantly</li>
          <li>• Better UX - less flickering results</li>
        </ul>
      </div>
    </div>
  );
}