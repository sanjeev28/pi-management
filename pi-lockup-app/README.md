# Pi Network Lockup Management Application

A comprehensive React application for managing Pi Network lockups with automated scheduling, beautiful UI, and secure authentication using mnemonic phrases.

## 🌟 Features

### Core Functionality
- **Passphrase Authentication**: Login using your 24-word Pi Network mnemonic phrase
- **Account Snapshot**: Real-time view of your Pi balance (total, available, locked)
- **Lockup Management**: Track and manage your Pi lockups with maturity dates
- **Auto-Send Configuration**: Automatically send unlocked Pi to specified addresses
- **Scheduler System**: Automated processing of matured lockups via edge functions

### UI/UX Features
- **Modern Design**: Beautiful, responsive UI with semantic design tokens
- **Dark/Light Mode**: Full theme support with system preference detection
- **Real-time Updates**: Live account data and scheduler status
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG compliant components with proper ARIA labels

### Security Features
- **Client-side Key Generation**: Stellar keypairs generated locally from mnemonics
- **Encrypted Storage**: Private keys encrypted with user-specific keys
- **Row Level Security**: Database access controlled by user identity
- **No Password Storage**: Uses Stellar public keys as user identifiers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Basic understanding of Pi Network and Stellar

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd pi-lockup-app
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Set up the database:**
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Run the contents of `database/schema.sql`

4. **Deploy the edge function:**
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Deploy the lockup scheduler function
supabase functions deploy lockup-scheduler
```

5. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **Stellar SDK** for cryptographic operations

### Backend Services
- **Supabase** for database and authentication
- **Edge Functions** for automated scheduling
- **Row Level Security** for data protection

### Database Schema

#### `lockups` table
```sql
- id (UUID) - Primary key
- user_id (TEXT) - Stellar public key
- amount (NUMERIC) - Pi amount locked
- balance_id (TEXT) - Reference to Pi Network balance
- lock_date (TIMESTAMPTZ) - When Pi was locked
- maturity_date (TIMESTAMPTZ) - When Pi becomes available
- status (TEXT) - 'locked', 'moveable', or 'sent'
- destination_address (TEXT) - Auto-send destination
- encrypted_key (TEXT) - Encrypted private key for auto-send
```

#### `user_preferences` table
```sql
- id (UUID) - Primary key
- user_id (TEXT) - Stellar public key
- default_destination_address (TEXT) - Default send address
- auto_send_enabled (BOOLEAN) - Auto-send toggle
- encrypted_private_key (TEXT) - Encrypted private key
```

## 🔐 Security Model

### Authentication Flow
1. User enters 24-word mnemonic phrase
2. Client generates Stellar keypair using `stellar-sdk`
3. Public key becomes user identifier
4. Private key used for transaction signing (never stored plaintext)

### Data Encryption
- Private keys encrypted with user-specific keys derived from public key
- AES encryption using crypto-js
- Encryption keys never leave the client

### Database Security
- Row Level Security (RLS) policies on all tables
- Users can only access their own data
- Service role used only for edge functions

## 🤖 Automated Scheduling

The lockup scheduler runs as a Supabase Edge Function:

### Functionality
- Checks for matured lockups every 4 hours
- Updates lockup status from 'locked' to 'moveable'
- Processes auto-send requests for enabled users
- Handles errors gracefully with detailed logging

### Deployment
```bash
supabase functions deploy lockup-scheduler --project-ref your-project-ref
```

### Manual Trigger
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/lockup-scheduler' \
  -H 'Authorization: Bearer your-anon-key'
```

## 🎨 Design System

### Color Palette
- **Primary**: Pi Network purple (#a855f7)
- **Secondary**: Neutral grays for text and backgrounds
- **Success**: Green for positive actions
- **Warning**: Amber for cautions
- **Error**: Red for errors

### Component Library
- Semantic design tokens (no hardcoded colors)
- Consistent spacing and typography
- Accessible color contrasts
- Responsive breakpoints

## 📱 Usage Guide

### Getting Started
1. **Login**: Enter your 24-word Pi Network mnemonic phrase
2. **Dashboard**: View your account snapshot and recent transactions
3. **Lockups**: Monitor active lockups and their maturity dates
4. **Auto-Send**: Configure automatic sending of unlocked Pi

### Auto-Send Setup
1. Click "Auto-Send Setup" in Quick Actions
2. Toggle auto-send enabled
3. Enter destination Pi Network address (starts with 'G')
4. Provide your private key for transaction signing
5. Save configuration

### Security Best Practices
- Never share your mnemonic phrase or private key
- Use auto-send only with addresses you control
- Regularly check scheduler status and transaction history
- Keep your browser and system updated

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Third-party integrations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── pages/              # Page components
```

### Key Files
- `src/lib/crypto.ts` - Cryptographic utilities
- `src/lib/supabase.ts` - Supabase client configuration
- `src/hooks/useAuth.tsx` - Authentication state management
- `database/schema.sql` - Database schema and RLS policies

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository to your deployment platform
2. Set environment variables
3. Deploy with build command: `npm run build`

### Database Setup
1. Create Supabase project
2. Run database schema from `database/schema.sql`
3. Configure RLS policies
4. Deploy edge functions

## 🔮 Future Enhancements

- **Real Pi Network Integration**: Connect to actual Pi Network APIs
- **Advanced Analytics**: Detailed lockup performance metrics
- **Multi-language Support**: Internationalization
- **Mobile App**: React Native version
- **Push Notifications**: Lockup maturity alerts
- **Batch Operations**: Bulk lockup management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for educational and demonstration purposes. Always verify transactions and use at your own risk. The developers are not responsible for any financial losses.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Join our community discussions

---

Built with ❤️ for the Pi Network community