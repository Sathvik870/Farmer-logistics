import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  userId: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('access_token='));
    
    if (token) {
      try {
        const decoded = jwtDecode<{ sub: number; username: string; role: string }>(token.split('=')[1]);
        setUser({ userId: decoded.sub, username: decoded.username, role: decoded.role });
      } catch (error) {
        console.error("Invalid token found in cookie", error);
        setUser(null);
      }
    }
    
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};