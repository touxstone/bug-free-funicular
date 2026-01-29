'use client'

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthDemo() {
  const { user, login, logout, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoginLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoginLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  // Logged OUT state
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Auth Context Demo 🔐
        </h3>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
          <p className="font-semibold text-blue-800 mb-2">💡 Try it:</p>
          <p className="text-xs text-blue-700">
            Enter any email and password. The login is simulated (2 sec delay).
          </p>
        </div>
      </div>
    );
  }
  
  // Logged IN state
  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">
        Welcome Back! 👋
      </h3>
      
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <p className="font-bold text-lg">{user?.name}</p>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-semibold text-green-800 mb-1">
            ✅ Authentication Status
          </p>
          <p className="text-xs text-green-700">
            You are logged in. Your session persists across page reloads.
          </p>
        </div>
        
        <button
          onClick={logout}
          className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-purple-50 rounded-lg text-sm">
        <p className="font-semibold text-purple-800 mb-2">🔧 How it works:</p>
        <ul className="space-y-1 text-xs text-purple-700">
          <li>• Auth state stored in Context</li>
          <li>• Persisted in localStorage</li>
          <li>• Accessible from any component</li>
          <li>• Simulates async login (2s delay)</li>
        </ul>
      </div>
    </div>
  );
}