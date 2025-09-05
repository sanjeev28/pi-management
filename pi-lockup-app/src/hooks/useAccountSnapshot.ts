import { useState, useEffect } from 'react';
import type { AccountSnapshot } from '../types';

// Mock Pi Network API - In a real implementation, this would connect to Pi Network's API
const mockAccountSnapshot: AccountSnapshot = {
  total_pi: 1250.75,
  available_pi: 750.25,
  locked_pi: 500.50,
  balances: [
    {
      id: 'bal_1',
      amount: 750.25,
      type: 'available',
    },
    {
      id: 'bal_2',
      amount: 250.25,
      type: 'locked',
      lock_date: '2024-01-15T10:00:00Z',
      maturity_date: '2024-12-15T10:00:00Z',
    },
    {
      id: 'bal_3',
      amount: 250.25,
      type: 'locked',
      lock_date: '2024-02-01T10:00:00Z',
      maturity_date: '2025-02-01T10:00:00Z',
    },
  ],
  transactions: [
    {
      id: 'tx_1',
      type: 'lock',
      amount: 250.25,
      date: '2024-02-01T10:00:00Z',
      status: 'completed',
      description: 'Pi locked for 12 months',
    },
    {
      id: 'tx_2',
      type: 'unlock',
      amount: 100.00,
      date: '2024-01-15T10:00:00Z',
      status: 'completed',
      description: 'Pi unlocked after maturity',
    },
    {
      id: 'tx_3',
      type: 'receive',
      amount: 50.00,
      date: '2024-01-10T10:00:00Z',
      status: 'completed',
      description: 'Pi received from mining',
    },
  ],
};

export function useAccountSnapshot(publicKey: string | undefined) {
  const [snapshot, setSnapshot] = useState<AccountSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setLoading(false);
      return;
    }

    const fetchAccountSnapshot = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, this would be:
        // const response = await fetch(`/api/pi-network/account/${publicKey}`);
        // const data = await response.json();
        
        setSnapshot(mockAccountSnapshot);
      } catch (err) {
        setError('Failed to fetch account snapshot');
        console.error('Account snapshot error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountSnapshot();
  }, [publicKey]);

  const refetch = () => {
    if (publicKey) {
      const fetchAccountSnapshot = async () => {
        setLoading(true);
        setError(null);

        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          setSnapshot(mockAccountSnapshot);
        } catch (err) {
          setError('Failed to fetch account snapshot');
        } finally {
          setLoading(false);
        }
      };

      fetchAccountSnapshot();
    }
  };

  return { snapshot, loading, error, refetch };
}