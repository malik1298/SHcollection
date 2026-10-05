import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CustomerUser } from '../types/index.js';

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginCustomer: (email: string, name?: string, phone?: string) => void;
  logoutCustomer: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const CUSTOMER_STORAGE_KEY = 'sh_customer_profile_v1';

export const CustomerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (customer) {
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
      } else {
        localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to persist customer profile:', err);
    }
  }, [customer]);

  const loginCustomer = (email: string, name?: string, phone?: string) => {
    const formattedName = name && name.trim() ? name.trim() : email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
    const user: CustomerUser = {
      id: 'cust-' + Date.now(),
      email: email.trim().toLowerCase(),
      name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
      phone: phone ? phone.trim() : '',
      createdAt: new Date().toISOString(),
    };
    setCustomer(user);
    setIsLoginModalOpen(false);
  };

  const logoutCustomer = () => {
    setCustomer(null);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoggedIn: !!customer,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginCustomer,
        logoutCustomer,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = (): CustomerAuthContextType => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
