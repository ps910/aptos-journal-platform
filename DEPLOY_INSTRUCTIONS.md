# 🚀 Smart Contract Deployment Instructions

## Your Account Details

**Your Aptos Testnet Account Address:**
\`\`\`
0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143
\`\`\`

## Step 1: Fund Your Account

Since the automated faucet is currently unavailable, please use the web faucet:

1. Visit: https://aptos.dev/network/faucet
2. Paste your address: `0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143`
3. Click "Fund Account" or "Get APT"
4. Wait for confirmation (usually 5-10 seconds)

**Alternative Faucets:**
- https://aptoslabs.com/testnet-faucet
- Discord Aptos bot: Join https://discord.gg/aptoslabs

## Step 2: Verify You Have Funds

\`\`\`powershell
cd c:\Users\pramo\Music\aptos\move
aptos account list --account default
\`\`\`

You should see a balance like `1000000000` (which is 10 APT in Octas).

## Step 3: Compile the Smart Contract

\`\`\`powershell
aptos move compile
\`\`\`

You should see "Success" message.

## Step 4: Deploy the Smart Contract

\`\`\`powershell
aptos move publish --named-addresses journal_platform=0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143
\`\`\`

When prompted, type `yes` to confirm.

## Step 5: Initialize the Platform

After successful deployment, run:

\`\`\`powershell
aptos move run --function-id '0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143::journal::initialize'
\`\`\`

Type `yes` when prompted.

## Step 6: Update Frontend Configuration

1. Open: `c:\Users\pramo\Music\aptos\frontend\src\contexts\WalletContext.jsx`

2. Find this line (around line 23):
\`\`\`javascript
const MODULE_ADDRESS = '0xYOUR_MODULE_ADDRESS_HERE';
\`\`\`

3. Replace with:
\`\`\`javascript
const MODULE_ADDRESS = '0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143';
\`\`\`

4. Save the file

## Step 7: Update Frontend .env

1. Open: `c:\Users\pramo\Music\aptos\frontend\.env`

2. Update the MODULE_ADDRESS line:
\`\`\`
VITE_MODULE_ADDRESS=0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143
\`\`\`

3. Save the file

## Step 8: Test!

Your app should automatically reload. Now you can:
1. Connect your Petra wallet
2. Make sure your Petra wallet is on Testnet
3. Try creating a journal!

## Troubleshooting

**If "aptos move compile" fails:**
- Make sure you're in the `move` directory
- Check that Move.toml has your address

**If deployment fails:**
- Check you have enough APT (need at least 0.5 APT for gas)
- Make sure you're on testnet

**If frontend can't interact:**
- Verify MODULE_ADDRESS is updated in both files
- Restart the frontend server
- Check browser console for errors

## Quick Commands Reference

\`\`\`powershell
# Check balance
aptos account list --account default

# Compile
aptos move compile

# Deploy
aptos move publish --named-addresses journal_platform=0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143

# Initialize
aptos move run --function-id '0x6a639d81460080d53d82b59f25a19c83b017e6729e4f2e98c9e5002cf265d143::journal::initialize'
\`\`\`

---

**Note:** Keep this file safe! It contains your account address which you'll need for reference.
