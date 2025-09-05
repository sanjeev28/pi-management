import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as StellarSdk from "https://esm.sh/@stellar/stellar-sdk@12.0.1";
import CryptoJS from "https://esm.sh/crypto-js@4.2.0";

interface Lockup {
  id: string;
  user_id: string;
  amount: number;
  balance_id: string;
  lock_date: string;
  maturity_date: string;
  status: 'locked' | 'moveable' | 'sent';
  destination_address?: string;
  encrypted_key?: string;
}

interface UserPreferences {
  id: string;
  user_id: string;
  default_destination_address?: string;
  auto_send_enabled: boolean;
  encrypted_private_key?: string;
}

// Crypto utilities (duplicated from client for edge function)
function decryptData(encryptedData: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function generateUserEncryptionKey(publicKey: string, additionalEntropy?: string): string {
  const data = publicKey + (additionalEntropy || '');
  return CryptoJS.SHA256(data).toString();
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🚀 Starting lockup scheduler...');

    // Get all matured lockups that are still locked
    const { data: maturedLockups, error: lockupsError } = await supabase
      .from('lockups')
      .select('*')
      .eq('status', 'locked')
      .lt('maturity_date', new Date().toISOString());

    if (lockupsError) {
      throw new Error(`Failed to fetch matured lockups: ${lockupsError.message}`);
    }

    console.log(`📊 Found ${maturedLockups?.length || 0} matured lockups`);

    if (!maturedLockups || maturedLockups.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No matured lockups found', 
          processed: 0,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    let processedCount = 0;
    let autoSentCount = 0;
    const errors: string[] = [];

    // Process each matured lockup
    for (const lockup of maturedLockups as Lockup[]) {
      try {
        console.log(`🔄 Processing lockup ${lockup.id} for user ${lockup.user_id}`);

        // Update lockup status to moveable
        const { error: updateError } = await supabase
          .from('lockups')
          .update({ status: 'moveable' })
          .eq('id', lockup.id);

        if (updateError) {
          throw new Error(`Failed to update lockup ${lockup.id}: ${updateError.message}`);
        }

        processedCount++;
        console.log(`✅ Lockup ${lockup.id} marked as moveable`);

        // Check if user has auto-send enabled
        const { data: preferences, error: prefsError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', lockup.user_id)
          .single();

        if (prefsError && prefsError.code !== 'PGRST116') {
          console.error(`❌ Failed to fetch preferences for user ${lockup.user_id}: ${prefsError.message}`);
          continue;
        }

        const userPrefs = preferences as UserPreferences | null;

        if (!userPrefs?.auto_send_enabled || !userPrefs.encrypted_private_key || !userPrefs.default_destination_address) {
          console.log(`⏭️ Auto-send not enabled for user ${lockup.user_id}, skipping`);
          continue;
        }

        // Decrypt private key
        let privateKey: string;
        try {
          const encryptionKey = generateUserEncryptionKey(lockup.user_id);
          privateKey = decryptData(userPrefs.encrypted_private_key, encryptionKey);
        } catch (decryptError) {
          console.error(`❌ Failed to decrypt private key for user ${lockup.user_id}`);
          errors.push(`Failed to decrypt private key for user ${lockup.user_id}`);
          continue;
        }

        // TODO: Implement actual Pi Network transaction
        // This is a placeholder for the actual Pi Network API integration
        console.log(`💸 Would send ${lockup.amount} Pi from ${lockup.user_id} to ${userPrefs.default_destination_address}`);
        
        // For now, we'll just simulate the transaction and mark as sent
        // In a real implementation, you would:
        // 1. Create and sign a Stellar transaction
        // 2. Submit it to the Pi Network
        // 3. Wait for confirmation
        // 4. Update the lockup status based on the result

        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update lockup as sent (in real implementation, only do this after successful transaction)
        const { error: sentError } = await supabase
          .from('lockups')
          .update({ 
            status: 'sent',
            destination_address: userPrefs.default_destination_address
          })
          .eq('id', lockup.id);

        if (sentError) {
          console.error(`❌ Failed to mark lockup ${lockup.id} as sent: ${sentError.message}`);
          errors.push(`Failed to mark lockup ${lockup.id} as sent`);
          continue;
        }

        autoSentCount++;
        console.log(`✅ Auto-sent ${lockup.amount} Pi for lockup ${lockup.id}`);

      } catch (error) {
        console.error(`❌ Error processing lockup ${lockup.id}:`, error);
        errors.push(`Error processing lockup ${lockup.id}: ${error.message}`);
      }
    }

    const result = {
      message: 'Lockup scheduler completed',
      processed: processedCount,
      autoSent: autoSentCount,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    };

    console.log('🎉 Scheduler completed:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: errors.length > 0 ? 207 : 200 // 207 Multi-Status if there were some errors
      }
    );

  } catch (error) {
    console.error('💥 Scheduler error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});