-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET row_security = on;

-- Create lockups table
CREATE TABLE IF NOT EXISTS public.lockups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Stellar public key
    amount NUMERIC(20, 7) NOT NULL CHECK (amount > 0),
    balance_id TEXT NOT NULL,
    lock_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    maturity_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'moveable', 'sent')),
    destination_address TEXT,
    encrypted_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE, -- Stellar public key
    default_destination_address TEXT,
    auto_send_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    encrypted_private_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lockups_user_id ON public.lockups(user_id);
CREATE INDEX IF NOT EXISTS idx_lockups_status ON public.lockups(status);
CREATE INDEX IF NOT EXISTS idx_lockups_maturity_date ON public.lockups(maturity_date);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_lockups_updated_at 
    BEFORE UPDATE ON public.lockups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON public.user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.lockups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lockups table
-- Users can only access their own lockups
CREATE POLICY "Users can view their own lockups" ON public.lockups
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own lockups" ON public.lockups
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own lockups" ON public.lockups
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true))
    WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own lockups" ON public.lockups
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- Create RLS policies for user_preferences table
-- Users can only access their own preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true))
    WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own preferences" ON public.user_preferences
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- Create a function to set the current user context
CREATE OR REPLACE FUNCTION set_current_user_id(user_id TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage on the function to authenticated users
GRANT EXECUTE ON FUNCTION set_current_user_id(TEXT) TO authenticated;

-- Create a view for lockup analytics
CREATE OR REPLACE VIEW lockup_analytics AS
SELECT 
    user_id,
    COUNT(*) as total_lockups,
    SUM(amount) as total_locked_amount,
    SUM(CASE WHEN status = 'locked' THEN amount ELSE 0 END) as currently_locked,
    SUM(CASE WHEN status = 'moveable' THEN amount ELSE 0 END) as ready_to_move,
    AVG(EXTRACT(EPOCH FROM (maturity_date - lock_date)) / 86400) as avg_lock_days,
    MIN(lock_date) as first_lockup_date,
    MAX(maturity_date) as latest_maturity_date
FROM public.lockups
GROUP BY user_id;

-- Enable RLS on the view
ALTER VIEW lockup_analytics SET (security_barrier = true);

-- Create RLS policy for the analytics view
CREATE POLICY "Users can view their own analytics" ON lockup_analytics
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));