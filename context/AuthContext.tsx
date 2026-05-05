import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserRole, Driver, Company, Partner, ValidationStatus } from '../constants/Types';
import { authClient } from '../lib/api';
import { apiFetch } from '../lib/fetcher';

type MeResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole | 'admin' | 'team_member';
    status: ValidationStatus;
    phone?: string;
    emailVerified: boolean;
  };
  driver: Driver | null;
  company: Company | null;
  partner: Partner | null;
};

type AuthState = {
  role: UserRole | null;
  isLoading: boolean;
  status: ValidationStatus | null;
  emailVerified: boolean;
  userId: string | null;
  currentDriver: Driver | null;
  currentCompany: Company | null;
  currentPartner: Partner | null;
};

type AuthContextType = AuthState & {
  refresh: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  role: null,
  isLoading: true,
  status: null,
  emailVerified: false,
  userId: null,
  currentDriver: null,
  currentCompany: null,
  currentPartner: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const hydrateFromMe = useCallback(async () => {
    try {
      // Wait for expo client to hydrate session from SecureStore before fetching /api/me.
      // Without this, getCookie() returns empty on cold start → 401 → false unauthenticated.
      const session = await authClient.getSession();
      if (!session?.data?.session) {
        setState({ ...initialState, isLoading: false });
        return;
      }
      const me = await apiFetch<MeResponse>('/api/me');
      const role = (['driver', 'advertiser', 'partner'].includes(me.user.role)
        ? (me.user.role as UserRole)
        : null);
      setState({
        role,
        isLoading: false,
        status: me.user.status,
        emailVerified: me.user.emailVerified,
        userId: me.user.id,
        currentDriver: me.driver,
        currentCompany: me.company,
        currentPartner: me.partner,
      });
    } catch {
      setState({ ...initialState, isLoading: false });
    }
  }, []);

  useEffect(() => {
    hydrateFromMe();
  }, [hydrateFromMe]);

  const signInEmail = useCallback(
    async (email: string, password: string) => {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) {
        throw new Error(res.error.message ?? 'Connexion échouée');
      }
      await hydrateFromMe();
    },
    [hydrateFromMe],
  );

  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch {}
    setState({ ...initialState, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, refresh: hydrateFromMe, signInEmail, logout }}
    >
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
