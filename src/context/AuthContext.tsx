import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types/index.js';
import { api, setAuthToken, removeAuthToken, getAuthToken } from '../lib/api.js';

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ role: 'admin' | 'customer'; user: any }>;
  logout: () => void;
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword?: string }) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .verifyAuth()
      .then((res) => {
        setAdminUser(res.user);
      })
      .catch(() => {
        removeAuthToken();
        setAdminUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res.user.role === 'admin' || (res.user.role as string) === 'super_admin') {
      setAuthToken(res.token);
      setAdminUser(res.user as AdminUser);
      return { role: 'admin' as const, user: res.user };
    } else {
      return { role: 'customer' as const, user: res.user };
    }
  };

  const logout = () => {
    removeAuthToken();
    setAdminUser(null);
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword?: string }) => {
    return api.changePassword(data);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!adminUser,
        adminUser,
        loading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
