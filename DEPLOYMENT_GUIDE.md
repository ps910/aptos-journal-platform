# 🚀 Deployment Guide - Aptos Journal Platform

This guide will help you deploy your Aptos Journal platform to production.

## 📋 Prerequisites

1. GitHub account (to host your code)
2. Accounts on hosting platforms (all free tiers):
   - [Vercel](https://vercel.com) or [Netlify](https://netlify.com) - for frontend
   - [Render](https://render.com) or [Railway](https://railway.app) - for backend
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - for database

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

1. **Create Account**: Go to https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster**:
   - Choose "M0 Sandbox" (Free forever)
   - Select a cloud provider (AWS/Google/Azure)
   - Choose a region close to you
   - Click "Create"
3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `aptosjournal`
   - Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
4. **Whitelist IP Addresses**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://aptosjournal:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Save this string - you'll need it!

---

## 🖥️ Step 2: Deploy Backend (Node.js/Express)

### Option A: Using Render (Recommended - Free)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `aptos-journal-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free`
   
3. **Add Environment Variables**:
   - Click "Environment" tab
   - Add these variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string_from_step1
     JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
     ```
   - Click "Save Changes"

4. **Deploy**: Click "Create Web Service"

5. **Save Your Backend URL**: After deployment, copy the URL (e.g., `https://aptos-journal-backend.onrender.com`)

### Option B: Using Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js
6. Add environment variables in the "Variables" tab
7. Deploy!

---

## 🌐 Step 3: Deploy Frontend (React/Vite)

### Option A: Using Vercel (Recommended - Free)

1. **Update Frontend Environment Variables**:
   - Edit `frontend/.env`:
     ```bash
     VITE_API_URL=https://YOUR_BACKEND_URL_FROM_STEP2/api
     VITE_APTOS_NETWORK=testnet
     VITE_MODULE_ADDRESS=0xdf8185c47fe1be6c3bfceb8185da88769cfca09fc308cab61caa0a8b749c42b7
     ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   
3. **Add Environment Variables**:
   - In project settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     VITE_APTOS_NETWORK=testnet
     VITE_MODULE_ADDRESS=0xdf8185c47fe1be6c3bfceb8185da88769cfca09fc308cab61caa0a8b749c42b7
     ```

4. **Deploy**: Click "Deploy"

5. **Get Your Live URL**: After deployment, you'll get a URL like `https://aptos-journal.vercel.app`

### Option B: Using Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variables in Site settings
6. Deploy!

---

## ⚙️ Step 4: Update Backend CORS

After deploying frontend, update your backend to allow requests from your frontend domain:

1. Edit `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://your-frontend-url.vercel.app',  // Add your actual frontend URL
       'https://your-custom-domain.com'  // If you have a custom domain
     ]
   }));
   ```

2. Commit and push changes - Render will auto-redeploy

---

## 🔐 Step 5: Security Checklist

- [ ] Change JWT_SECRET to a strong random string (use: https://randomkeygen.com/)
- [ ] Update MongoDB password to something secure
- [ ] Never commit `.env` files to GitHub
- [ ] Add `.env` to `.gitignore`
- [ ] Enable HTTPS (automatically provided by Vercel/Render)

---

## 🎉 Step 6: Test Your Live Application

1. Visit your frontend URL
2. Connect Petra Wallet
3. Try creating a journal
4. Test reading journals
5. Check if payments work

---

## 📱 Optional: Custom Domain

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render:
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## 🐛 Troubleshooting

### Backend won't start:
- Check MongoDB connection string is correct
- Ensure all environment variables are set
- Check Render logs for errors

### Frontend can't connect to backend:
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Open browser console for errors

### Smart contract issues:
- Ensure contract is initialized on testnet
- Verify MODULE_ADDRESS is correct
- Check Petra Wallet is on testnet

---

## 💰 Costs

All services listed have generous free tiers:
- **MongoDB Atlas**: 512MB free forever
- **Render**: 750 hours/month free
- **Vercel**: Unlimited free deployments
- **Railway**: $5 free credit/month

**Total Monthly Cost: $0** (for small to medium traffic)

---

## 🚀 Quick Deploy Commands

If you want to deploy via command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Deploy backend (use platform-specific CLI or Git push)
```

---

## 📞 Support

If you encounter issues:
1. Check service status pages
2. Review deployment logs
3. Check browser console for errors
4. Verify all environment variables

---

## 🎊 You're Live!

Congratulations! Your Aptos Journal platform is now live and accessible to users worldwide! 🌍

Share your URL and let people start creating and reading journals on the blockchain!
