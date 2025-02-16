import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import mongose from 'mongoose';

interface User {
  email: string;
  name: string;
  Id: mongose.Schema.Types.ObjectId;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with backend
      verifyToken(token).then(userData => {
        setUser(userData);
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const res = await response.json();
    const data = res.data
    

    if (!response.ok) throw new Error(res.message);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name, Id: data._id }));
    setUser({ email: data.email, name: data.name, Id: data._id });
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name, Id: data._Id }));
    setUser({ email: data.email, name: data.name, Id: data._Id });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const verifyToken = async (token: string) => {
    const response = await fetch('http://localhost:5000/verify-token', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error('Invalid token');
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);