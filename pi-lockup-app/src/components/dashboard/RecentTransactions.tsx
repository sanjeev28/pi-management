import { ArrowUpRight, ArrowDownLeft, Lock, Unlock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAccountSnapshot } from '../../hooks/useAccountSnapshot';
import { useAuth } from '../../hooks/useAuth';
import { formatPiAmount } from '../../utils/format';
import { formatDateTime } from '../../utils/date';
import type { Transaction } from '../../types';

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'send':
      return ArrowUpRight;
    case 'receive':
      return ArrowDownLeft;
    case 'lock':
      return Lock;
    case 'unlock':
      return Unlock;
    default:
      return ArrowUpRight;
  }
};

const getTransactionColor = (type: Transaction['type']) => {
  switch (type) {
    case 'send':
      return 'text-error-600';
    case 'receive':
      return 'text-success-600';
    case 'lock':
      return 'text-warning-600';
    case 'unlock':
      return 'text-primary-600';
    default:
      return 'text-muted-foreground';
  }
};

const getStatusBadge = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return <Badge variant="success">Completed</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function RecentTransactions() {
  const { user } = useAuth();
  const { snapshot, loading } = useAccountSnapshot(user?.publicKey);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!snapshot?.transactions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No transactions found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {snapshot.transactions.slice(0, 5).map((transaction) => {
            const Icon = getTransactionIcon(transaction.type);
            const iconColor = getTransactionColor(transaction.type);
            
            return (
              <div key={transaction.id} className="flex items-center space-x-4">
                <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {transaction.description || `${transaction.type} transaction`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(transaction.date)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    transaction.type === 'send' ? 'text-error-600' : 'text-success-600'
                  }`}>
                    {transaction.type === 'send' ? '-' : '+'}
                    {formatPiAmount(transaction.amount)} π
                  </span>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}