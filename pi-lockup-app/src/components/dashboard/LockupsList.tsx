import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatPiAmount } from '../../utils/format';
import { formatDate, getDaysUntilMaturity, formatDuration } from '../../utils/date';

// Mock lockups data - in a real app, this would come from Supabase
const mockLockups = [
  {
    id: '1',
    amount: 250.25,
    balance_id: 'bal_2',
    lock_date: '2024-01-15T10:00:00Z',
    maturity_date: '2024-12-15T10:00:00Z',
    status: 'locked' as const,
  },
  {
    id: '2',
    amount: 250.25,
    balance_id: 'bal_3',
    lock_date: '2024-02-01T10:00:00Z',
    maturity_date: '2025-02-01T10:00:00Z',
    status: 'locked' as const,
  },
  {
    id: '3',
    amount: 100.00,
    balance_id: 'bal_4',
    lock_date: '2023-12-01T10:00:00Z',
    maturity_date: '2024-01-15T10:00:00Z',
    status: 'moveable' as const,
  },
];

const getStatusBadge = (status: string, maturityDate: string) => {
  const daysUntil = getDaysUntilMaturity(maturityDate);
  
  if (status === 'moveable' || daysUntil < 0) {
    return <Badge variant="success">Ready to Move</Badge>;
  }
  
  if (daysUntil <= 7) {
    return <Badge variant="warning">Maturing Soon</Badge>;
  }
  
  return <Badge variant="info">Locked</Badge>;
};

export function LockupsList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Lockups</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockLockups.map((lockup) => {
            const daysUntil = getDaysUntilMaturity(lockup.maturity_date);
            const isMatured = daysUntil < 0;
            
            return (
              <div
                key={lockup.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-pi-100 dark:bg-pi-900">
                    <Clock className="h-4 w-4 text-pi-600 dark:text-pi-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {formatPiAmount(lockup.amount)} π
                      </span>
                      {getStatusBadge(lockup.status, lockup.maturity_date)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(lockup.lock_date)}
                      </span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(lockup.maturity_date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    isMatured ? 'text-success-600' : 'text-muted-foreground'
                  }`}>
                    {isMatured ? 'Matured' : formatDuration(daysUntil)}
                  </div>
                  {!isMatured && (
                    <div className="text-xs text-muted-foreground">
                      {daysUntil} days remaining
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {mockLockups.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active lockups</p>
              <Button variant="outline" size="sm" className="mt-2">
                Create Your First Lockup
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}