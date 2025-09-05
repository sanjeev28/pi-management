import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatRelativeTime } from '../../utils/date';

interface SchedulerStatus {
  isRunning: boolean;
  lastRun?: string;
  nextRun?: string;
  processed: number;
  autoSent: number;
  errors: string[];
}

export function SchedulerStatus() {
  const [status, setStatus] = useState<SchedulerStatus>({
    isRunning: false,
    lastRun: '2024-01-15T14:30:00Z',
    nextRun: '2024-01-15T18:30:00Z',
    processed: 3,
    autoSent: 1,
    errors: []
  });
  const [loading, setLoading] = useState(false);

  const checkSchedulerStatus = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call the Supabase edge function
      // const response = await supabase.functions.invoke('lockup-scheduler');
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock status update
      setStatus(prevStatus => ({
        ...prevStatus,
        lastRun: new Date().toISOString(),
        processed: prevStatus.processed + Math.floor(Math.random() * 3),
        autoSent: prevStatus.autoSent + Math.floor(Math.random() * 2),
      }));
    } catch (error) {
      console.error('Failed to check scheduler status:', error);
    } finally {
      setLoading(false);
    }
  };

  const runSchedulerNow = async () => {
    setLoading(true);
    setStatus(prev => ({ ...prev, isRunning: true }));
    
    try {
      // In a real implementation, this would trigger the edge function
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStatus(prev => ({
        ...prev,
        isRunning: false,
        lastRun: new Date().toISOString(),
        processed: prev.processed + 2,
        autoSent: prev.autoSent + 1,
      }));
    } catch (error) {
      console.error('Failed to run scheduler:', error);
      setStatus(prev => ({ ...prev, isRunning: false }));
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh status every 5 minutes
  useEffect(() => {
    const interval = setInterval(checkSchedulerStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Scheduler Status</CardTitle>
        <div className="flex items-center space-x-2">
          {status.isRunning ? (
            <Badge variant="warning" className="animate-pulse">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Running
            </Badge>
          ) : (
            <Badge variant="success">
              <CheckCircle className="h-3 w-3 mr-1" />
              Idle
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Last Run</div>
            <div className="font-medium">
              {status.lastRun ? formatRelativeTime(status.lastRun) : 'Never'}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Next Run</div>
            <div className="font-medium">
              {status.nextRun ? formatRelativeTime(status.nextRun) : 'Unknown'}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-primary">{status.processed}</div>
            <div className="text-muted-foreground">Processed</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-success-600">{status.autoSent}</div>
            <div className="text-muted-foreground">Auto-Sent</div>
          </div>
        </div>

        {/* Errors */}
        {status.errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-error-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              Recent Errors
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              {status.errors.slice(0, 3).map((error, index) => (
                <div key={index} className="bg-error-50 dark:bg-error-900/20 p-2 rounded border-l-2 border-error-500">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkSchedulerStatus}
            disabled={loading}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={runSchedulerNow}
            disabled={loading || status.isRunning}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Run Now
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          The scheduler automatically checks for matured lockups every 4 hours and processes auto-send requests.
        </div>
      </CardContent>
    </Card>
  );
}