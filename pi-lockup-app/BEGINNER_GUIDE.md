# 🚀 Complete Beginner's Guide to Run Pi Network Lockup App

## 📋 Prerequisites (What You Need First)

### 1. Install Node.js
- Go to https://nodejs.org/
- Download the **LTS version** (recommended for most users)
- Run the installer and follow the setup wizard
- **Windows**: Just click "Next" through the installer
- **Mac**: Drag to Applications folder
- **Linux**: Follow the package manager instructions

### 2. Verify Installation
Open your terminal/command prompt and type:
```bash
node --version
npm --version
```
You should see version numbers like:
```
v18.17.0
9.6.7
```

## 🛠️ Step-by-Step Setup

### Step 1: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type "terminal", press Enter  
- **Linux**: Press `Ctrl + Alt + T`

### Step 2: Navigate to the Project
```bash
cd /workspace/pi-lockup-app
```

If you're not in the workspace, navigate to where you downloaded/cloned the project:
```bash
cd path/to/your/pi-lockup-app
```

### Step 3: Install Dependencies
```bash
npm install
```
This will take 1-2 minutes and install all required packages.

### Step 4: Start the Application
```bash
npm run dev
```

You should see output like:
```
> pi-network-lockup-manager@1.0.0 dev
> vite

  VITE v7.1.4  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Open in Browser
- Open your web browser (Chrome, Firefox, Safari, Edge)
- Go to: **http://localhost:5173**
- The Pi Network Lockup app should load!

## 🧪 How to Test the Application

### Step 1: Login Screen
When the app opens, you'll see a login screen asking for a "24-word mnemonic phrase"

### Step 2: Use Test Mnemonic
Copy and paste this test mnemonic phrase:
```
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art
```

**Important**: This is a TEST mnemonic only - never use it with real Pi!

### Step 3: Click "Access Dashboard"
The app will generate a test Stellar keypair and log you in.

### Step 4: Explore Features
Once logged in, you can:

1. **View Dashboard**: See your Pi balance overview
2. **Check Transactions**: View recent transaction history
3. **Manage Lockups**: See active Pi lockups
4. **Toggle Theme**: Click the moon/sun icon for dark/light mode
5. **Auto-Send Setup**: Click "Auto-Send Setup" to configure automatic sending
6. **Copy Public Key**: Click "Copy Public Key" to copy your Stellar address

## 🎯 What You Should See

### Login Page
- Clean white/purple interface
- Mnemonic input field
- "Access Dashboard" button
- Security notices

### Dashboard
- Account overview with Pi balances
- Recent transactions table
- Active lockups list
- Quick action buttons
- Scheduler status panel

### Features to Test
- ✅ Login with test mnemonic
- ✅ View mock account data
- ✅ Toggle dark/light theme
- ✅ Open auto-send configuration
- ✅ Copy public key to clipboard
- ✅ Responsive design (try resizing browser)

## 🚫 Troubleshooting Common Issues

### Issue 1: "npm: command not found"
**Solution**: Node.js isn't installed properly
- Reinstall Node.js from https://nodejs.org/
- Restart your terminal after installation

### Issue 2: "Cannot find module" errors
**Solution**: Dependencies not installed
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Port 5173 already in use
**Solution**: Either:
- Stop other applications using that port, OR
- Use a different port:
```bash
npm run dev -- --port 3000
```
Then open http://localhost:3000

### Issue 4: Browser shows "This site can't be reached"
**Solutions**:
- Make sure the dev server is still running (check terminal)
- Try http://127.0.0.1:5173 instead
- Check if firewall is blocking the port

### Issue 5: White screen or errors in browser
**Solutions**:
- Open browser developer tools (F12)
- Check console for errors
- Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)

## 🔄 How to Stop and Restart

### To Stop the Application
In the terminal where it's running:
- Press `Ctrl + C` (Windows/Linux)
- Press `Cmd + C` (Mac)

### To Restart
```bash
npm run dev
```

## 📱 Mobile Testing

### Test on Your Phone
1. Find your computer's IP address:
   - **Windows**: `ipconfig` in command prompt
   - **Mac/Linux**: `ifconfig` in terminal
   
2. Start the app with network access:
```bash
npm run dev -- --host
```

3. On your phone's browser, go to:
```
http://YOUR_IP_ADDRESS:5173
```
Example: `http://192.168.1.100:5173`

## 🏗️ Build for Production (Optional)

### Create Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```
Then open http://localhost:4173

## 📂 Project Structure (What's What)

```
pi-lockup-app/
├── src/                    # Source code
│   ├── components/         # React components (UI pieces)
│   ├── hooks/             # Custom React hooks (logic)
│   ├── lib/               # Third-party integrations
│   ├── types/             # TypeScript definitions
│   └── utils/             # Helper functions
├── public/                # Static files
├── database/              # Database schema
├── supabase/             # Backend functions
├── package.json          # Project configuration
└── README.md             # Documentation
```

## 🎓 Next Steps (After Testing)

### For Learning
1. Explore the code in `src/components/`
2. Check out the authentication in `src/hooks/useAuth.tsx`
3. Look at the dashboard in `src/components/dashboard/`

### For Real Use
1. Set up a Supabase account
2. Configure environment variables
3. Deploy to production
4. Connect to real Pi Network APIs

## 🆘 Need Help?

### Quick Checks
1. ✅ Node.js installed and working?
2. ✅ In the correct directory?
3. ✅ Ran `npm install` successfully?
4. ✅ No errors in terminal?
5. ✅ Browser pointing to correct URL?

### Common Commands Reference
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Stop the server
Ctrl + C (or Cmd + C on Mac)
```

## 🎉 Success!

If you can see the login screen and successfully log in with the test mnemonic, congratulations! 🎊

You now have a fully functional Pi Network Lockup Management Application running locally on your computer.

---

**Need more help?** Check the detailed documentation in `README.md` or `SETUP.md` files!