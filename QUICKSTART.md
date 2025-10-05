# ⚡ Quick Start Guide

Get your Aptos Journal platform running in 10 minutes!

## 🎯 Prerequisites

Before you start, make sure you have:
- [x] Node.js v18+ installed
- [x] Git installed
- [x] Text editor (VS Code recommended)

## 🚀 5-Step Quick Start

### Step 1: Install Dependencies (2 min)

\`\`\`powershell
# Navigate to project directory
cd aptos

# Install everything at once
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
\`\`\`

### Step 2: Set Up MongoDB (1 min)

**Option A - Quick (No Install):**
Use MongoDB Atlas (free cloud database):
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (takes 5 min to provision)
3. Get connection string
4. Skip to Step 3

**Option B - Local:**
\`\`\`powershell
# If MongoDB is installed
net start MongoDB
\`\`\`

### Step 3: Configure Environment (2 min)

**Backend:**
\`\`\`powershell
cd backend
copy .env.example .env
notepad .env
\`\`\`

Paste this (use your MongoDB Atlas string if using cloud):
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aptos-journal
JWT_SECRET=my-super-secret-key-12345
\`\`\`

**Frontend:**
\`\`\`powershell
cd ..\frontend
copy .env.example .env
notepad .env
\`\`\`

Paste this:
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_APTOS_NETWORK=testnet
VITE_MODULE_ADDRESS=0x1
\`\`\`

### Step 4: Install Aptos CLI & Deploy Contract (3 min)

\`\`\`powershell
# Install Aptos CLI
iwr "https://aptos.dev/scripts/install_cli.py" -useb | Select-Object -ExpandProperty Content | python

# Initialize Aptos account
cd ..\move
aptos init --network testnet
# Press Enter to generate new keypair
# SAVE YOUR ADDRESS!

# Get test tokens
# Visit: https://aptoslabs.com/testnet-faucet
# Paste your address and get APT

# Deploy contract (replace YOUR_ADDRESS)
aptos move compile
aptos move publish --named-addresses journal_platform=YOUR_ADDRESS

# Initialize platform
aptos move run --function-id 'YOUR_ADDRESS::journal::initialize'
\`\`\`

### Step 5: Update Config & Start (2 min)

**Update Frontend with your deployed address:**
\`\`\`powershell
cd ..\frontend
notepad src\contexts\WalletContext.jsx
\`\`\`

Find and replace:
\`\`\`javascript
const MODULE_ADDRESS = '0xYOUR_MODULE_ADDRESS_HERE';
// Change to:
const MODULE_ADDRESS = '0xYOUR_ACTUAL_DEPLOYED_ADDRESS';
\`\`\`

**Start Everything:**
\`\`\`powershell
cd ..
npm run dev
\`\`\`

## 🎉 You're Live!

Open http://localhost:3000 in your browser!

## 🔥 Quick Test

1. **Install Petra Wallet**
   - Add extension: https://petra.app/
   - Create wallet
   - Switch to Testnet
   - Get test APT: https://aptoslabs.com/testnet-faucet

2. **Create Account**
   - Click "Get Started"
   - Register with email
   - Login

3. **Connect Wallet**
   - Click "Connect Wallet"
   - Approve in Petra

4. **Create First Journal**
   - Go to "Add Journal"
   - Write something
   - Publish (costs 0.1 APT)
   - Confirm transaction

5. **Explore & Read**
   - Go to "Explore"
   - Read others' journals (costs 0.05 APT)

## ⚡ Even Faster Setup (Skip Deployment)

Want to test without deploying? Use our test contract:

1. Skip Step 4 (contract deployment)
2. Use this test address in `WalletContext.jsx`:
\`\`\`javascript
const MODULE_ADDRESS = '0x1';
\`\`\`
3. Some features may be limited

## 🆘 Quick Troubleshooting

**"Cannot connect to MongoDB"**
→ Use MongoDB Atlas (see Step 2, Option A)

**"Aptos CLI not found"**
→ Restart terminal after installing CLI

**"Insufficient balance"**
→ Visit faucet again: https://aptoslabs.com/testnet-faucet

**"Transaction failed"**
→ Check you have at least 0.15 APT for gas + fees

**"Port already in use"**
→ Change PORT in backend/.env to 5001

## 📱 What You Can Do Now

✅ Register users
✅ Connect Petra wallet
✅ Create journals (0.1 APT)
✅ Read journals (0.05 APT)
✅ Earn from reads
✅ Reclaim journals
✅ View transactions
✅ Track earnings

## 📚 Learn More

- **Full Documentation**: See README.md
- **Deployment Guide**: See DEPLOYMENT.md
- **Features**: See FEATURES.md
- **Aptos Docs**: https://aptos.dev/

## 🎯 Next Steps

1. Create multiple test accounts
2. Test full journal lifecycle
3. Check transactions on Explorer
4. Customize the UI
5. Add your own features
6. Deploy to production

## 💡 Pro Tips

- Keep test APT in wallet (0.5+ APT recommended)
- Use descriptive journal titles
- Test from multiple browsers/accounts
- Check Aptos Explorer for verification
- Save your private keys safely
- Use .env files (never commit them!)

---

Need help? Check the full README.md or open an issue!

**Happy Building! 🚀**
