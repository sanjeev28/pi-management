import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Save, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useAuth } from '../../hooks/useAuth';
import { isValidPiAddress, encryptData, decryptData, generateUserEncryptionKey } from '../../lib/crypto';

interface AutoSendSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AutoSendSetup({ isOpen, onClose }: AutoSendSetupProps) {
  const { user } = useAuth();
  const { preferences, loading, updatePreferences } = useUserPreferences();
  
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (preferences) {
      setAutoSendEnabled(preferences.auto_send_enabled);
      setDestinationAddress(preferences.default_destination_address || '');
      
      // Decrypt private key if it exists
      if (preferences.encrypted_private_key && user?.publicKey) {
        try {
          const encryptionKey = generateUserEncryptionKey(user.publicKey);
          const decryptedKey = decryptData(preferences.encrypted_private_key, encryptionKey);
          setPrivateKey(decryptedKey);
        } catch (err) {
          console.error('Failed to decrypt private key:', err);
        }
      }
    }
  }, [preferences, user?.publicKey]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (autoSendEnabled) {
      if (!destinationAddress.trim()) {
        newErrors.destinationAddress = 'Destination address is required when auto-send is enabled';
      } else if (!isValidPiAddress(destinationAddress)) {
        newErrors.destinationAddress = 'Please enter a valid Pi Network address (starts with G)';
      }

      if (!privateKey.trim()) {
        newErrors.privateKey = 'Private key is required for auto-send functionality';
      } else if (privateKey.length < 50) {
        newErrors.privateKey = 'Private key appears to be invalid (too short)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      let encryptedPrivateKey = '';
      
      if (autoSendEnabled && privateKey && user?.publicKey) {
        const encryptionKey = generateUserEncryptionKey(user.publicKey);
        encryptedPrivateKey = encryptData(privateKey, encryptionKey);
      }

      const result = await updatePreferences({
        auto_send_enabled: autoSendEnabled,
        default_destination_address: autoSendEnabled ? destinationAddress : undefined,
        encrypted_private_key: encryptedPrivateKey || undefined,
      });

      if (result.success) {
        onClose();
        // TODO: Show success toast
      } else {
        // TODO: Show error toast
        console.error('Failed to save preferences:', result.error);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Auto-Send Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure automatic sending of unlocked Pi to a specified address
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Security Warning */}
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription>
              Auto-send requires storing your encrypted private key. While we use strong encryption, 
              only enable this feature if you understand the security implications.
            </AlertDescription>
          </Alert>

          {/* Enable Auto-Send Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium">
                Enable Auto-Send
              </label>
              <div className="text-sm text-muted-foreground">
                Automatically send unlocked Pi to your specified address
              </div>
            </div>
            <Switch
              checked={autoSendEnabled}
              onCheckedChange={setAutoSendEnabled}
            />
          </div>

          {autoSendEnabled && (
            <>
              {/* Destination Address */}
              <div className="space-y-2">
                <label htmlFor="destination" className="text-sm font-medium">
                  Destination Address *
                </label>
                <Input
                  id="destination"
                  placeholder="G... (Pi Network address)"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className={errors.destinationAddress ? 'border-error-500' : ''}
                />
                {errors.destinationAddress && (
                  <p className="text-sm text-error-600">{errors.destinationAddress}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter the Pi Network address where unlocked Pi should be sent automatically
                </p>
              </div>

              {/* Private Key */}
              <div className="space-y-2">
                <label htmlFor="privateKey" className="text-sm font-medium">
                  Private Key *
                </label>
                <div className="relative">
                  <Textarea
                    id="privateKey"
                    placeholder="Enter your private key for signing transactions..."
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className={`min-h-[100px] ${errors.privateKey ? 'border-error-500' : ''} ${
                      showPrivateKey ? '' : 'font-mono tracking-wider'
                    }`}
                    style={showPrivateKey ? {} : { WebkitTextSecurity: 'disc' }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                  >
                    {showPrivateKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.privateKey && (
                  <p className="text-sm text-error-600">{errors.privateKey}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your private key will be encrypted and stored securely. It's needed to sign transactions automatically.
                </p>
              </div>

              {/* Additional Security Info */}
              <Alert variant="info">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>How it works:</strong> When a lockup matures, our scheduler will automatically 
                  send the Pi to your specified address using your encrypted private key. The key is 
                  encrypted with your public key and can only be decrypted by you.
                </AlertDescription>
              </Alert>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || loading}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}