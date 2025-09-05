import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AuthState, User } from '../types';
import { generateKeypairFromMnemonic, validateMnemonic } from '../lib/crypto';

interface AuthContextType extends AuthState {
  login: (mnemonic: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case 'LOGIN_ERROR':
      return {
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case 'RESTORE_SESSION':
      return {
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true, // Start with loading true to check for existing session
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pi-lockup-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'RESTORE_SESSION', payload: user });
      } catch {
        localStorage.removeItem('pi-lockup-user');
        dispatch({ type: 'LOGIN_ERROR' });
      }
    } else {
      dispatch({ type: 'LOGIN_ERROR' });
    }
  }, []);

  const login = async (mnemonic: string): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Validate mnemonic
      if (!validateMnemonic(mnemonic)) {
        dispatch({ type: 'LOGIN_ERROR' });
        return { success: false, error: 'Invalid mnemonic phrase. Please check your 24-word passphrase.' };
      }

      // Generate keypair
      const user = generateKeypairFromMnemonic(mnemonic);
      
      // Store user session (only public key for security)
      const sessionUser = { publicKey: user.publicKey, secretKey: '' };
      localStorage.setItem('pi-lockup-user', JSON.stringify(sessionUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('pi-lockup-user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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