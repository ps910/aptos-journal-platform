# 🚀 Deployment Guide - Aptos Journal Platform

## Quick Start Deployment

This guide will help you deploy the Aptos Journal platform from scratch.

## 📋 Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] Aptos CLI installed
- [ ] Petra Wallet extension installed
- [ ] Git installed
- [ ] Test APT tokens in your wallet

## 🔧 Step-by-Step Deployment

### Step 1: Install Dependencies

Open PowerShell in the project root and run:

\`\`\`powershell
# Install all dependencies
npm run install:all
\`\`\`

Or manually:

\`\`\`powershell
# Root
npm install

# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
cd ..
\`\`\`

### Step 2: Install Aptos CLI

\`\`\`powershell
# Windows (PowerShell)
iwr "https://aptos.dev/scripts/install_cli.py" -useb | Select-Object -ExpandProperty Content | python
\`\`\`

Verify installation:
\`\`\`powershell
aptos --version
\`\`\`

### Step 3: Create Aptos Account

\`\`\`powershell
cd move
aptos init --network testnet
\`\`\`

Follow the prompts:
- Choose "testnet" when asked for network
- Press Enter to generate new key pair
- Note down your account address!

Your account details will be saved in `.aptos/config.yaml`

### Step 4: Fund Your Account

1. Copy your account address from the previous step
2. Visit: https://aptoslabs.com/testnet-faucet
3. Paste your address and request test APT tokens
4. Wait for confirmation

Verify balance:
\`\`\`powershell
aptos account list --account YOUR_ACCOUNT_ADDRESS
\`\`\`

### Step 5: Update Move Configuration

Edit `move/Move.toml`:

\`\`\`toml
[addresses]
journal_platform = "0xYOUR_ACCOUNT_ADDRESS_HERE"  # Replace with your address
\`\`\`

### Step 6: Compile and Deploy Smart Contract

\`\`\`powershell
cd move

# Compile the contract
aptos move compile

# Deploy to testnet (replace with your address)
aptos move publish --named-addresses journal_platform=0xYOUR_ADDRESS
\`\`\`

When prompted, type `yes` to confirm.

### Step 7: Initialize the Platform

After successful deployment:

\`\`\`powershell
aptos move run --function-id '0xYOUR_ADDRESS::journal::initialize'
\`\`\`

**IMPORTANT**: Save your deployed module address! You'll need it for frontend configuration.

### Step 8: Set Up Backend Environment

\`\`\`powershell
cd ..\backend
copy .env.example .env
\`\`\`

Edit `backend\.env`:

\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aptos-journal
JWT_SECRET=change-this-to-a-long-random-string-12345
\`\`\`

### Step 9: Start MongoDB

**Option A: Local MongoDB**
\`\`\`powershell
# Start MongoDB service
net start MongoDB
\`\`\`

**Option B: MongoDB Atlas**
1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update MONGODB_URI in .env

### Step 10: Set Up Frontend Environment

\`\`\`powershell
cd ..\frontend
copy .env.example .env
\`\`\`

Edit `frontend\.env`:

\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_APTOS_NETWORK=testnet
VITE_MODULE_ADDRESS=0xYOUR_DEPLOYED_MODULE_ADDRESS
\`\`\`

### Step 11: Update Frontend Wallet Context

Edit `frontend\src\contexts\WalletContext.jsx`:

Find this line:
\`\`\`javascript
const MODULE_ADDRESS = '0xYOUR_MODULE_ADDRESS_HERE';
\`\`\`

Replace with your deployed module address:
\`\`\`javascript
const MODULE_ADDRESS = '0xYOUR_ACTUAL_ADDRESS';
\`\`\`

### Step 12: Start the Application

**Option A: Run Everything Together**
\`\`\`powershell
cd ..
npm run dev
\`\`\`

**Option B: Run Separately**

Terminal 1 - Backend:
\`\`\`powershell
cd backend
npm run dev
\`\`\`

Terminal 2 - Frontend:
\`\`\`powershell
cd frontend
npm run dev
\`\`\`

### Step 13: Access the Application

Open your browser:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Testing the Application

### 1. Create Account
1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill registration form
4. Login with credentials

### 2. Connect Petra Wallet
1. Install Petra Wallet extension if not already
2. Create/Import wallet
3. Switch to Testnet
4. Get test APT from faucet
5. Click "Connect Wallet" in the app
6. Approve connection

### 3. Create Journal
1. Navigate to "Add Journal"
2. Write title and content
3. Click "Publish Journal"
4. Approve transaction in Petra (0.1 APT)
5. Wait for confirmation

### 4. Test Reading
1. Open another browser (Incognito)
2. Create second account
3. Connect different wallet with test APT
4. Go to "Explore" section
5. Read a journal (pays 0.05 APT to author)

### 5. Check Earnings
1. Return to first account
2. Go to "My Journals"
3. See updated earnings
4. View transaction history

### 6. Test Reclaim
1. In "My Journals"
2. Click "Reclaim" on any journal
3. Confirm transaction
4. Get 0.1 APT refund
5. Journal becomes inactive

## 🔍 Verification Steps

### Verify Smart Contract Deployment

Visit Aptos Explorer:
https://explorer.aptoslabs.com/account/YOUR_ADDRESS?network=testnet

You should see:
- Your account balance
- Deployed modules
- Transaction history

### Verify Backend

Test API endpoint:
\`\`\`powershell
curl http://localhost:5000
\`\`\`

Should return:
\`\`\`json
{"message": "Aptos Journal API Server Running"}
\`\`\`

### Verify Frontend

Check browser console for errors:
- Press F12
- Look for any red errors
- Confirm wallet connection works

## ⚠️ Common Issues & Solutions

### Issue 1: Aptos CLI Not Found
**Solution:**
\`\`\`powershell
# Add to PATH or run from Aptos CLI directory
\`\`\`

### Issue 2: Insufficient Balance
**Solution:**
- Visit testnet faucet again
- Request more test APT
- Wait a few seconds

### Issue 3: Module Already Exists
**Solution:**
- You've already deployed
- Use existing address
- Or create new account

### Issue 4: MongoDB Connection Failed
**Solution:**
\`\`\`powershell
# Check if MongoDB is running
net start MongoDB

# Or use MongoDB Atlas
# Update connection string in .env
\`\`\`

### Issue 5: Port Already in Use
**Solution:**
\`\`\`powershell
# Kill process using port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
\`\`\`

### Issue 6: Petra Wallet Not Connecting
**Solution:**
- Refresh page
- Lock/unlock wallet
- Switch to testnet network
- Clear browser cache

## 📊 Monitoring & Logs

### Check Backend Logs
Look for:
- ✅ MongoDB Connected
- 🚀 Server running on http://localhost:5000

### Check Frontend Logs
Browser console should show:
- No errors
- Wallet connection status
- Transaction confirmations

### Check Blockchain Transactions
Visit: https://explorer.aptoslabs.com/?network=testnet
- Search your address
- View all transactions
- Verify contract calls

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
\`\`\`powershell
cd frontend
npm run build
# Deploy dist folder
\`\`\`

### Backend (Heroku/Railway/DigitalOcean)
\`\`\`powershell
cd backend
# Set environment variables
# Deploy with your platform
\`\`\`

### Smart Contract (Mainnet)
⚠️ **WARNING**: Deploying to mainnet requires real APT tokens!

\`\`\`powershell
aptos init --network mainnet
aptos move publish --network mainnet
\`\`\`

## 📝 Environment Variables Checklist

### Backend (.env)
- [ ] PORT
- [ ] MONGODB_URI
- [ ] JWT_SECRET

### Frontend (.env)
- [ ] VITE_API_URL
- [ ] VITE_APTOS_NETWORK
- [ ] VITE_MODULE_ADDRESS

### Move (Move.toml)
- [ ] journal_platform address

## 🎉 Success Checklist

- [ ] Smart contract deployed
- [ ] Platform initialized
- [ ] Backend server running
- [ ] Frontend app running
- [ ] Wallet connected
- [ ] Journal created successfully
- [ ] Journal read successfully
- [ ] Earnings received
- [ ] Reclaim works
- [ ] Transactions visible on explorer

## 📞 Need Help?

If you encounter issues:

1. Check this deployment guide
2. Review README.md
3. Check Aptos documentation: https://aptos.dev/
4. Aptos Discord: https://discord.gg/aptoslabs
5. Review browser console for errors
6. Check server logs for backend issues

## 🎊 Congratulations!

You've successfully deployed the Aptos Journal platform! 🎉

Now you can:
- Create journals
- Earn from reads
- Explore community journals
- Track transactions
- Build on this foundation

Happy journaling on the blockchain! 📝✨
