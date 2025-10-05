# 🚀 FINAL STEP - Deploy Your Smart Contract

## ✅ Progress So Far:
- ✅ Switched to your Petra wallet address: `0xb6fba...0445`
- ✅ Updated all configuration files
- ✅ Compiled smart contract successfully
- ✅ Your wallet has APT funds

## 🔑 Now You Need to Export Your Private Key

### Step 1: Export Private Key from Petra

1. **Open Petra Wallet** extension
2. Click **Settings** (gear icon)
3. Go to **"Account"** → **"Manage Account"**
4. Click **"Export Private Key"**
5. Enter your password
6. **Copy the private key** (starts with `0x`)

### Step 2: Import to Aptos CLI

Run this command (replace YOUR_PRIVATE_KEY with what you copied):

```powershell
cd c:\Users\pramo\Music\aptos\move
aptos init --profile mywallet --private-key YOUR_PRIVATE_KEY_HERE --network testnet
```

**Example:**
```powershell
aptos init --profile mywallet --private-key 0x1234567890abcdef... --network testnet
```

### Step 3: Deploy the Contract

After importing, run:

```powershell
aptos move publish --profile mywallet --named-addresses journal_platform=0xb6fba530f95308bcfe758d6f72daef25915fbd8ffa155d881ea41fb13cf10445
```

Type `yes` when prompted.

### Step 4: Initialize Platform

```powershell
aptos move run --profile mywallet --function-id '0xb6fba530f95308bcfe758d6f72daef25915fbd8ffa155d881ea41fb13cf10445::journal::initialize'
```

Type `yes` when prompted.

---

## ⚡ Quick Commands (All in One):

```powershell
# Navigate to move directory
cd c:\Users\pramo\Music\aptos\move

# Import your wallet (replace YOUR_PRIVATE_KEY)
aptos init --profile mywallet --private-key YOUR_PRIVATE_KEY_HERE --network testnet

# Deploy contract
aptos move publish --profile mywallet --named-addresses journal_platform=0xb6fba530f95308bcfe758d6f72daef25915fbd8ffa155d881ea41fb13cf10445

# Initialize platform
aptos move run --profile mywallet --function-id '0xb6fba530f95308bcfe758d6f72daef25915fbd8ffa155d881ea41fb13cf10445::journal::initialize'
```

---

## 🎯 After Deployment:

1. ✅ Refresh your website at http://localhost:3000
2. ✅ Connect your Petra wallet
3. ✅ Try creating a journal - it will work!
4. ✅ No more "Module not found" error!

---

## 🔒 Security Note:

- Your private key never leaves your computer
- It's only used locally by Aptos CLI
- After deployment, you can delete the CLI profile if you want
- Your Petra wallet remains completely separate and secure

---

## 📝 Summary:

**What's Happening:**
- Your Petra wallet (`0xb6fba...0445`) will deploy and own the contract
- All users (including you) can interact with it through the website
- You're paying gas fees from your wallet (already funded!)

**Ready?** Export your private key and run the commands above! 🚀
