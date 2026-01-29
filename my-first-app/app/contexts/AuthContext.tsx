'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Cargar usuario de localStorage al montar
  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('app-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
    setIsLoading(false);
  }, []);
  
  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (mounted) {
      if (user) {
        localStorage.setItem('app-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('app-user');
      }
    }
  }, [user, mounted]);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simular API call (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular login exitoso
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
    };
    
    setUser(mockUser);
    setIsLoading(false);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {mounted ? children : null}
      {/* {mounted && children} */}
      
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}