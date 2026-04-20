import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, Driver, Company } from '../constants/Types';
import { mockDrivers, mockCompanies } from '../mocks/data';

const ROLE_STORAGE_KEY = '@publeader_role';

type AuthState = {
  role: UserRole | null;
  isLoading: boolean;
  currentDriver: Driver | null;
  currentCompany: Company | null;
};

type AuthContextType = AuthState & {
  setRole: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    role: null,
    isLoading: true,
    currentDriver: null,
    currentCompany: null,
  });

  useEffect(() => {
    loadRole();
  }, []);

  const loadRole = async () => {
    try {
      const savedRole = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole && ['driver', 'company', 'admin'].includes(savedRole)) {
        const role = savedRole as UserRole;
        setState({
          role,
          isLoading: false,
          currentDriver: role === 'driver' ? mockDrivers[0] : null,
          currentCompany: role === 'company' ? mockCompanies[0] : null,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const setRole = async (role: UserRole) => {
    await AsyncStorage.setItem(ROLE_STORAGE_KEY, role);
    setState({
      role,
      isLoading: false,
      currentDriver: role === 'driver' ? mockDrivers[0] : null,
      currentCompany: role === 'company' ? mockCompanies[0] : null,
    });
  };

  const logout = async () => {
    await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
    setState({
      role: null,
      isLoading: false,
      currentDriver: null,
      currentCompany: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, setRole, logout }}>
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
