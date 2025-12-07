import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'user' | 'service-center';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, User> = {
  'user@demo.com': {
    id: '1',
    email: 'user@demo.com',
    name: 'John Mitchell',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  'service@demo.com': {
    id: '2',
    email: 'service@demo.com',
    name: 'AutoCare Center',
    role: 'service-center',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('autocare_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo, accept any email/password with selected role
    const mockUser = mockUsers[email] || {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: role === 'user' ? 'Demo User' : 'Demo Service Center',
      role,
      avatar: role === 'user' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        : 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    };

    const userWithRole = { ...mockUser, role };
    setUser(userWithRole);
    localStorage.setItem('autocare_user', JSON.stringify(userWithRole));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('autocare_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
