import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Identifiants en dur pour la démo
const ADMIN_EMAIL = 'admin@acfruit.com';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setUser(true);
        return;
      }
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}