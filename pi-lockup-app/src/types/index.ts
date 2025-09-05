export interface Lockup {
  id: string;
  user_id: string;
  amount: number;
  balance_id: string;
  lock_date: string;
  maturity_date: string;
  status: 'locked' | 'moveable' | 'sent';
  destination_address?: string;
  encrypted_key?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  default_destination_address?: string;
  auto_send_enabled: boolean;
  encrypted_private_key?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountSnapshot {
  total_pi: number;
  available_pi: number;
  locked_pi: number;
  balances: Balance[];
  transactions: Transaction[];
}

export interface Balance {
  id: string;
  amount: number;
  type: 'available' | 'locked';
  lock_date?: string;
  maturity_date?: string;
}

export interface Transaction {
  id: string;
  type: 'lock' | 'unlock' | 'send' | 'receive';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
}

export interface User {
  publicKey: string;
  secretKey: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}