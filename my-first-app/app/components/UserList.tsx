'use client'

import { useState, useEffect } from 'react';

// Tipo para los usuarios de la API
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

export default function UserList() {
  // Estados
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // useEffect para fetch cuando el componente monta
  useEffect(() => {
    // Función async dentro del useEffect
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching users...');
        
        // Fetch de la API
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        // Verificar si la respuesta es OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parsear JSON
        const data = await response.json();
        
        console.log('✅ Users fetched:', data.length);
        
        // Actualizar estado
        setUsers(data);
      } catch (err) {
        // Manejar errores
        console.error('❌ Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        // Siempre ejecuta esto (haya error o no)
        setLoading(false);
      }
    };
    
    // Llamar la función
    fetchUsers();
  }, []); // Array vacío = solo corre una vez al montar
  
  // Render de loading
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }
  
  // Render de error
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Error Loading Users</h4>
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render de datos
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4">Users from API 👥</h3>
      
      <p className="text-sm text-gray-600 mb-4">
        Fetched from: <code className="bg-gray-100 px-2 py-1 rounded text-xs">jsonplaceholder.typicode.com</code>
      </p>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {users.map(user => (
          <div
            key={user.id}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {user.name}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📧 {user.email}</p>
                  <p>📞 {user.phone}</p>
                  <p>🌐 {user.website}</p>
                  <p className="text-xs text-gray-500">
                    Company: {user.company.name}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                ID: {user.id}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          ✅ Successfully loaded {users.length} users
        </p>
      </div>
    </div>
  );
}