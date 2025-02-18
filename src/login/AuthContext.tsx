import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import mongose, { set } from 'mongoose';

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
const API_URL = import.meta.env.VITE_API_URL;
// console.log("api", API_URL);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with backend
      verifyToken(token).then(userData => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      // credentials: 'include',
    });

    const res = await response.json();
    const data = res.data
    

    if (!response.ok) throw new Error(res.message);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name, Id: data._id }));
    setUser({ email: data.email, name: data.name, Id: data._id });
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/register`, {
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
    localStorage.removeItem('user');
    setUser(null);
  };

  const verifyToken = async (token: string) => {
    const response = await fetch(`${API_URL}/verify-token`, {
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