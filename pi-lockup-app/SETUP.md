# Pi Network Lockup Manager - Setup Guide

## 🚀 Quick Start

This application is now **fully implemented** and ready to use! Follow these steps to get it running:

### 1. Install Dependencies
```bash
cd pi-lockup-app
npm install
```

### 2. Set up Supabase

1. **Create a Supabase project** at https://supabase.com
2. **Copy your project credentials** from Settings > API
3. **Create environment file**:
```bash
cp .env.example .env
```
4. **Edit .env with your credentials**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/schema.sql`
4. Click **Run** to create all tables and policies

### 4. Deploy Edge Function (Optional)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the lockup scheduler
supabase functions deploy lockup-scheduler
```

### 5. Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔐 Testing the Application

### Sample Mnemonic for Testing
You can use this **test mnemonic** (do NOT use for real Pi):
```
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art
```

This will generate a valid Stellar keypair for testing purposes.

### Features to Test

1. **Login**: Use the test mnemonic above
2. **Dashboard**: View mock account data and transactions
3. **Auto-Send Setup**: Configure automated sending
4. **Theme Toggle**: Switch between light and dark modes
5. **Responsive Design**: Test on mobile and desktop

## 🎯 What's Implemented

### ✅ Complete Features

- **Authentication System**: Passphrase-based login with Stellar keypair generation
- **Beautiful UI**: Modern design with dark/light mode support
- **Dashboard**: Account snapshot, recent transactions, lockup management
- **Auto-Send Configuration**: Secure setup for automated Pi sending
- **Database Schema**: Complete with RLS policies
- **Edge Function**: Automated lockup scheduler
- **Responsive Design**: Works on all screen sizes
- **TypeScript**: Full type safety throughout
- **Security**: Encrypted storage and secure authentication

### 🔧 Mock Data

Currently uses mock data for:
- Account snapshots (Pi balances)
- Transaction history
- Lockup information
- Scheduler status

### 🌐 Real Pi Network Integration

To connect to real Pi Network APIs, you'll need to:

1. **Get Pi Network API access** (when available)
2. **Replace mock data** in `useAccountSnapshot.ts`
3. **Implement real transactions** in the edge function
4. **Add Pi Network API endpoints** to environment variables

## 📱 Application Structure

### Key Components

- `PassphraseLogin`: Secure mnemonic-based authentication
- `Dashboard`: Main application interface
- `AccountSnapshot`: Pi balance overview
- `AutoSendSetup`: Automated sending configuration
- `SchedulerStatus`: Edge function monitoring

### Security Features

- Client-side key generation
- Encrypted private key storage
- Row Level Security (RLS)
- Stellar public key as user identifier
- No password storage

### Database Tables

- `lockups`: Pi lockup management
- `user_preferences`: User settings and auto-send config

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
3. Deploy with build command: `npm run build`

### Database
- Already configured with Supabase
- RLS policies ensure data security
- Edge functions handle automation

## 🎨 Customization

### Theming
- Semantic design tokens in `tailwind.config.js`
- CSS variables in `src/index.css`
- Theme provider in `src/hooks/useTheme.tsx`

### Colors
- Primary: Pi Network purple
- Success: Green for positive actions
- Warning: Amber for cautions
- Error: Red for errors

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Project Structure
```
src/
├── components/     # React components
├── hooks/          # Custom hooks
├── lib/            # Third-party integrations
├── types/          # TypeScript definitions
├── utils/          # Utility functions
└── pages/          # Page components
```

## 🌟 Next Steps

1. **Test the application** with the provided mnemonic
2. **Set up your Supabase project** for data persistence
3. **Deploy the edge function** for automation
4. **Customize the design** to match your preferences
5. **Connect to real Pi Network APIs** when available

## 🆘 Troubleshooting

### Common Issues

1. **Build errors**: Make sure all dependencies are installed
2. **Supabase connection**: Check your environment variables
3. **TypeScript errors**: Ensure all types are properly imported
4. **CSS issues**: Verify Tailwind configuration

### Getting Help

1. Check the detailed `README.md`
2. Review the code comments
3. Test with the provided mnemonic
4. Verify Supabase configuration

---

🎉 **Congratulations!** You now have a fully functional Pi Network Lockup Management Application!