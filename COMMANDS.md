# 🎯 Common Commands Reference

Quick reference for all the commands you'll need.

## 📦 Installation Commands

\`\`\`powershell
# Install all dependencies
npm run install:all

# Or manually
npm install                    # Root
cd frontend && npm install     # Frontend
cd backend && npm install      # Backend
\`\`\`

## 🚀 Development Commands

\`\`\`powershell
# Run everything (frontend + backend)
npm run dev

# Run separately
npm run dev:frontend          # Start frontend only
npm run dev:backend           # Start backend only

# Or manual
cd frontend && npm run dev    # Frontend on :3000
cd backend && npm run dev     # Backend on :5000
\`\`\`

## 🏗️ Build Commands

\`\`\`powershell
# Build frontend for production
cd frontend
npm run build
npm run preview              # Preview production build
\`\`\`

## ⛓️ Aptos CLI Commands

### Setup & Account Management

\`\`\`powershell
# Install Aptos CLI
iwr "https://aptos.dev/scripts/install_cli.py" -useb | Select-Object -ExpandProperty Content | python

# Check version
aptos --version

# Initialize new account
cd move
aptos init --network testnet

# Check account info
aptos account list --account YOUR_ADDRESS

# Get account balance
aptos account balance --account YOUR_ADDRESS

# Fund account (use faucet instead)
# Visit: https://aptoslabs.com/testnet-faucet
\`\`\`

### Smart Contract Commands

\`\`\`powershell
# Compile contract
cd move
aptos move compile

# Test contract
aptos move test

# Publish contract
aptos move publish --named-addresses journal_platform=YOUR_ADDRESS

# Run function (initialize platform)
aptos move run --function-id 'YOUR_ADDRESS::journal::initialize'

# View function (get platform stats)
aptos move view --function-id 'YOUR_ADDRESS::journal::get_platform_stats' --args address:YOUR_ADDRESS
\`\`\`

## 🗄️ MongoDB Commands

\`\`\`powershell
# Start MongoDB (Windows)
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Connect to MongoDB shell
mongo

# Or using mongosh
mongosh

# Show databases
show dbs

# Use database
use aptos-journal

# Show collections
show collections

# Find all users
db.users.find()

# Drop database (CAREFUL!)
db.dropDatabase()
\`\`\`

## 🐛 Debugging Commands

\`\`\`powershell
# Check ports in use
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process by PID
taskkill /PID <PID> /F

# Check Node version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
\`\`\`

## 🔍 Git Commands

\`\`\`powershell
# Initialize git
git init

# Check status
git status

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin YOUR_REPO_URL

# Push
git push -u origin main

# Pull latest
git pull origin main
\`\`\`

## 📊 Helpful Commands

### Frontend

\`\`\`powershell
cd frontend

# Install new package
npm install package-name

# Remove package
npm uninstall package-name

# Update packages
npm update

# Check outdated packages
npm outdated

# Lint (if configured)
npm run lint

# Format (if configured)
npm run format
\`\`\`

### Backend

\`\`\`powershell
cd backend

# Start with nodemon (auto-restart)
npm run dev

# Start production
npm start

# Install new package
npm install package-name

# Check for security issues
npm audit

# Fix security issues
npm audit fix
\`\`\`

## 🔐 Environment Setup

\`\`\`powershell
# Copy environment files
cd backend
copy .env.example .env

cd ..\frontend
copy .env.example .env
\`\`\`

## 🧪 Testing Commands

\`\`\`powershell
# Test Move contract
cd move
aptos move test

# Test with coverage
aptos move test --coverage

# Run frontend tests (if configured)
cd frontend
npm test

# Run backend tests (if configured)
cd backend
npm test
\`\`\`

## 📦 Package Management

\`\`\`powershell
# List installed packages
npm list

# List global packages
npm list -g --depth=0

# Update npm
npm install -g npm@latest

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update specific package
npm update package-name
\`\`\`

## 🌐 Network Commands

\`\`\`powershell
# Check API endpoint
curl http://localhost:5000

# Test with body
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password"}'

# Check if port is open
Test-NetConnection -ComputerName localhost -Port 5000
\`\`\`

## 🔄 Update Commands

\`\`\`powershell
# Update all packages (interactive)
npm update

# Update to latest versions
npx npm-check-updates -u
npm install

# Update Aptos CLI
# Download latest from aptos.dev
\`\`\`

## 📝 Quick Snippets

### Create New User via API

\`\`\`powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"username":"testuser","email":"test@test.com","password":"password123"}'
\`\`\`

### Get User Profile

\`\`\`powershell
curl http://localhost:5000/api/user/profile `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

### Query Aptos Node Directly

\`\`\`powershell
# Get account info
curl https://fullnode.testnet.aptoslabs.com/v1/accounts/YOUR_ADDRESS

# Get transactions
curl https://fullnode.testnet.aptoslabs.com/v1/accounts/YOUR_ADDRESS/transactions
\`\`\`

## 🚨 Emergency Commands

### Reset Everything

\`\`\`powershell
# Remove all dependencies
Remove-Item -Recurse -Force frontend/node_modules, backend/node_modules, node_modules

# Remove build files
Remove-Item -Recurse -Force frontend/dist

# Reinstall
npm run install:all
\`\`\`

### Clear Database

\`\`\`powershell
# Connect to MongoDB
mongosh

# Use database
use aptos-journal

# Drop all collections
db.dropDatabase()

# Exit
exit
\`\`\`

### Restart Services

\`\`\`powershell
# Stop all Node processes
taskkill /IM node.exe /F

# Restart MongoDB
net stop MongoDB
net start MongoDB

# Restart development servers
npm run dev
\`\`\`

## 📱 Useful URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Status**: http://localhost:5000
- **Aptos Explorer**: https://explorer.aptoslabs.com/?network=testnet
- **Testnet Faucet**: https://aptoslabs.com/testnet-faucet
- **Petra Wallet**: https://petra.app/

## 🎯 Development Workflow

\`\`\`powershell
# 1. Start MongoDB
net start MongoDB

# 2. Start backend (Terminal 1)
cd backend
npm run dev

# 3. Start frontend (Terminal 2)
cd frontend
npm run dev

# 4. Open browser
# http://localhost:3000

# 5. Make changes and save (auto-reload)
\`\`\`

## 📊 Monitoring Commands

\`\`\`powershell
# Watch backend logs
cd backend
npm run dev

# Watch frontend logs
cd frontend
npm run dev

# Check running processes
Get-Process node

# Check memory usage
Get-Process node | Select-Object Name, CPU, Memory
\`\`\`

---

## 💡 Pro Tips

1. **Use separate terminals** for frontend and backend
2. **Keep MongoDB running** in background
3. **Save your Aptos private key** securely
4. **Test on testnet** before mainnet
5. **Check logs** when errors occur
6. **Use .env files** for configuration
7. **Clear cache** if weird issues occur
8. **Update regularly** for security

---

**Quick Access**: Bookmark this file for easy reference! 🔖
