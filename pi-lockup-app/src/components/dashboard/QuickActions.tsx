import { Lock, Send, Settings, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface QuickActionsProps {
  onAutoSendClick?: () => void;
}

export function QuickActions({ onAutoSendClick }: QuickActionsProps) {
  const actions = [
    {
      title: 'Create Lockup',
      description: 'Lock Pi for a specific period',
      icon: Lock,
      variant: 'pi' as const,
      onClick: () => {
        // TODO: Implement create lockup modal
        console.log('Create lockup clicked');
      },
    },
    {
      title: 'Send Pi',
      description: 'Transfer Pi to another address',
      icon: Send,
      variant: 'default' as const,
      onClick: () => {
        // TODO: Implement send Pi modal
        console.log('Send Pi clicked');
      },
    },
    {
      title: 'Auto-Send Setup',
      description: 'Configure automatic sending',
      icon: Settings,
      variant: 'outline' as const,
      onClick: onAutoSendClick || (() => console.log('Auto-send setup clicked')),
    },
    {
      title: 'View Analytics',
      description: 'Track your Pi performance',
      icon: TrendingUp,
      variant: 'secondary' as const,
      onClick: () => {
        // TODO: Implement analytics view
        console.log('Analytics clicked');
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={action.onClick}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}