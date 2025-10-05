# 🚀 QUICK DEPLOYMENT GUIDE

## Choose Your Deployment Method:

---

## METHOD 1: Deploy with Your Petra Wallet (Your Address)

### Step 1: Export Private Key from Petra
1. Open Petra Wallet extension in your browser
2. Click **Settings** (gear icon)
3. Go to **"Account"** → **"Manage Account"**
4. Click **"Export Private Key"**
5. Enter your password
6. **COPY the private key** (starts with `0x`)

### Step 2: Import to CLI and Deploy
Run these commands one by one:

```powershell
cd c:\Users\pramo\Music\aptos\move

# Import your wallet
aptos init --profile mywallet --private-key YOUR_PRIVATE_KEY_HERE --network testnet

# Deploy the contract (type 'yes' when prompted)
aptos move publish --profile mywallet --named-addresses journal_platform=0xb6fba530f95308bcfe758d6f72daef25915fbd8ffa155d881ea41fb13cf10445

# Initialize the platform (type 'yes' when prompted)
aptos move run --profile mywallet --function-id '0xb6fba530f95308bcfe758d6f72daef25915fbd8ffa155d881ea41fb13cf10445::journal::initialize'
```

✅ **DONE!** Your app will work immediately after this.

---

## METHOD 2: Deploy with CLI-Generated Account (Easier but different address)

If you don't want to export your Petra private key, use the CLI account we created earlier:

```powershell
cd c:\Users\pramo\Music\aptos\move

# First, update Move.toml back to CLI address
# (I can do this for you - just say "use CLI account")

# Then fund the CLI account from faucet:
# Visit: https://aptos.dev/network/faucet
# Address: 0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143

# Deploy with CLI account
aptos move publish --profile default --named-addresses journal_platform=0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143

# Initialize
aptos move run --profile default --function-id '0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143::journal::initialize'
```

Then I'll update the frontend to use the CLI address.

---

## ⚡ FASTEST PATH (Recommended):

**Tell me which method you prefer:**

1. **"use petra"** - I'll wait while you export your private key, then guide you through deployment
2. **"use CLI"** - I'll switch everything to CLI account, you fund it from faucet, and I'll deploy

**Which method do you want to use?**

---

## 🔒 Security Note:
- Method 1: Uses your real wallet (more convenient for testing)
- Method 2: Uses separate CLI wallet (more secure, keeps wallets separate)

Both methods work perfectly! Choose what you're comfortable with.
