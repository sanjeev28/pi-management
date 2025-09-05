import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../hooks/useAuth';

export function PassphraseLogin() {
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedMnemonic = mnemonic.trim();
    if (!trimmedMnemonic) {
      setError('Please enter your mnemonic phrase');
      return;
    }

    const words = trimmedMnemonic.split(/\s+/);
    if (words.length !== 24) {
      setError('Mnemonic phrase must contain exactly 24 words');
      return;
    }

    const result = await login(trimmedMnemonic);
    if (!result.success) {
      setError(result.error || 'Authentication failed');
    }
  };

  const handleMnemonicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMnemonic(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pi-50 via-primary-50 to-secondary-50 dark:from-pi-950 dark:via-primary-950 dark:to-secondary-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pi-100 dark:bg-pi-900">
            <Lock className="h-8 w-8 text-pi-600 dark:text-pi-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Pi Network Lockup</CardTitle>
          <CardDescription>
            Enter your 24-word mnemonic phrase to access your lockup management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="mnemonic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Mnemonic Phrase
              </label>
              <div className="relative">
                <Textarea
                  id="mnemonic"
                  placeholder="Enter your 24-word mnemonic phrase..."
                  value={mnemonic}
                  onChange={handleMnemonicChange}
                  className={`min-h-[120px] resize-none ${showMnemonic ? '' : 'font-mono tracking-wider'}`}
                  style={showMnemonic ? {} : { WebkitTextSecurity: 'disc' }}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  disabled={loading}
                >
                  {showMnemonic ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your mnemonic phrase is used to generate your Stellar keypair locally and is never stored or transmitted.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              variant="pi"
              size="lg"
              className="w-full"
              disabled={loading || !mnemonic.trim()}
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Alert variant="info">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-left">
                <strong>Security Notice:</strong> This application uses your Pi Network mnemonic phrase to generate your Stellar keypair locally. Your private key never leaves your device.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}