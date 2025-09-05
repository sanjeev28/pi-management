import { Wallet, TrendingUp, Lock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useAccountSnapshot } from '../../hooks/useAccountSnapshot';
import { useAuth } from '../../hooks/useAuth';
import { formatPiAmount } from '../../utils/format';

export function AccountSnapshot() {
  const { user } = useAuth();
  const { snapshot, loading, error, refetch } = useAccountSnapshot(user?.publicKey);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {error || 'Failed to load account snapshot'}
            </p>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const cards = [
    {
      title: 'Total Pi',
      value: snapshot.total_pi,
      icon: Wallet,
      description: 'Total Pi in your account',
      gradient: 'from-pi-500 to-pi-600',
    },
    {
      title: 'Available Pi',
      value: snapshot.available_pi,
      icon: TrendingUp,
      description: 'Pi available for transactions',
      gradient: 'from-success-500 to-success-600',
    },
    {
      title: 'Locked Pi',
      value: snapshot.locked_pi,
      icon: Lock,
      description: 'Pi currently locked up',
      gradient: 'from-warning-500 to-warning-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Account Overview</h2>
          <p className="text-muted-foreground">
            Current snapshot of your Pi Network account
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPiAmount(card.value)} π
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}