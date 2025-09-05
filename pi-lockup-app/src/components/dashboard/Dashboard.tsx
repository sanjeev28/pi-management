import React, { useState } from 'react';
import { Copy, LogOut, Settings, Moon, Sun, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AccountSnapshot } from './AccountSnapshot';
import { RecentTransactions } from './RecentTransactions';
import { LockupsList } from './LockupsList';
import { QuickActions } from './QuickActions';
import { SchedulerStatus } from './SchedulerStatus';
import { AutoSendSetup } from './AutoSendSetup';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { truncateAddress, formatDateTime } from '../../utils/format';
import { getCurrentTimestamp } from '../../utils/date';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { actualTheme, setTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(getCurrentTimestamp());
  const [showAutoSendSetup, setShowAutoSendSetup] = useState(false);

  // Update current time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimestamp());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  const copyPublicKey = async () => {
    if (user?.publicKey) {
      await navigator.clipboard.writeText(user.publicKey);
      // In a real app, you'd show a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-pi-600 dark:text-pi-400">
                Pi Lockup Manager
              </h1>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(currentTime)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {actualTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Account Information</span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyPublicKey}
                className="ml-auto"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Public Key
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Stellar Public Key
                </label>
                <p className="font-mono text-sm bg-muted px-3 py-2 rounded-md">
                  {user?.publicKey ? truncateAddress(user.publicKey, 12, 12) : 'Not available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Snapshot */}
        <AccountSnapshot />

        {/* Quick Actions */}
        <QuickActions onAutoSendClick={() => setShowAutoSendSetup(true)} />

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <RecentTransactions />
            <LockupsList />
          </div>
          <div className="space-y-8">
            <SchedulerStatus />
          </div>
        </div>
      </main>

      {/* Auto-Send Setup Modal */}
      <AutoSendSetup 
        isOpen={showAutoSendSetup} 
        onClose={() => setShowAutoSendSetup(false)} 
      />
    </div>
  );
}