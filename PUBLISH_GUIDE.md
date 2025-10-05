# 🚀 Deploy Your Smart Contract

## ✅ Step 1: Compilation Complete!
Your smart contract has been successfully compiled! ✓

## 📦 Step 2: Deploy the Contract

Since you're using your Petra wallet address (`0xb6fba530f95308bcfe758d6f72daef25915fbd8ffa155d881ea41fb13cf10445`), you have **two options** to deploy:

### Option A: Deploy via Petra Wallet (Recommended & Easier)

**Unfortunately, Petra wallet doesn't support direct contract deployment from the UI yet.** So we'll use Option B.

### Option B: Deploy via CLI with Private Key Export

1. **Export your private key from Petra:**
   - Open Petra wallet extension
   - Click Settings (gear icon)
   - Go to "Manage Account" or "Account Details"
   - Click "Export Private Key"
   - **Copy your private key securely**

2. **Import your account to Aptos CLI:**
   ```powershell
   cd c:\Users\pramo\Music\aptos\move
   aptos init --profile mainwallet --private-key YOUR_PRIVATE_KEY_HERE --network testnet
   ```

3. **Deploy the contract:**
   ```powershell
   aptos move publish --profile mainwallet --named-addresses journal_platform=0xb6fba530f95308bcfe758d6f72daef25915fbd8ffa155d881ea41fb13cf10445
   ```
   
   Type `yes` when prompted.

4. **Initialize the platform:**
   ```powershell
   aptos move run --profile mainwallet --function-id '0xb6fba530f95308bcfe758d6f72daef25915fbd8ffa155d881ea41fb13cf10445::journal::initialize'
   ```
   
   Type `yes` when prompted.

---

## 🎉 After Deployment

Your app is **already configured** with your wallet address! Just:
1. Refresh the browser at http://localhost:3000
2. Connect your Petra wallet
3. Try creating a journal - it will work! ✨

---

## ⚠️ Security Note
- **Never share your private key with anyone**
- After deployment, you can delete the CLI profile if you want
- Your Petra wallet is still completely separate and secure

---

## 🆘 Need Help?

If you're not comfortable exporting your private key, you can:
1. Use the CLI-generated account (fund it from faucet)
2. Or I can guide you through a different deployment method

Let me know if you need any help with these steps!
