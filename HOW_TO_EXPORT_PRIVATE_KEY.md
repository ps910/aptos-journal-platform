# 🔑 How to Find Your Private Key in Petra Wallet

## Step-by-Step Guide with Details:

### Method 1: Export Private Key (Recommended)

1. **Open Petra Wallet Extension**
   - Click on the Petra icon in your browser toolbar
   - Make sure you're logged in

2. **Click on the Three Dots (⋮) or Menu**
   - Usually in the top right corner of the wallet

3. **Look for One of These Options:**
   - "Settings" or "Account Settings"
   - "Security & Privacy"
   - "Manage Account"
   - "Account Details"

4. **Find "Export Private Key" or "Show Private Key"**
   - This might be under:
     - Settings → Security
     - Account → Export Private Key
     - Three dots next to your account → Export Key

5. **Enter Your Petra Password**
   - You'll be asked to confirm with your wallet password

6. **Copy the Private Key**
   - It will start with `0x`
   - Example: `0x1234567890abcdef...`
   - Click "Copy" or select and copy it

---

### Method 2: Via Account Menu

1. **Open Petra Wallet**
2. **Click on your account name/address at the top**
3. **Look for "Manage Accounts" or similar**
4. **Select your account**
5. **Find "Export Private Key" option**

---

### Method 3: Settings Path

**Try this exact path:**

Petra Wallet → **Settings (⚙️)** → **Account** → **Export Private Key**

OR

Petra Wallet → **Three Dots (⋮)** → **Settings** → **Security** → **Export Private Key**

---

## 🔒 Security Tips:

- ⚠️ **NEVER share your private key with anyone!**
- ⚠️ **Don't paste it in public chats or websites**
- ✅ **Only use it locally on your computer**
- ✅ **We're using it only for Aptos CLI deployment**

---

## 🆘 Alternative: Use a New Account

If you can't find the private key option, you can:

1. **Create a new Petra account** specifically for this project
2. **Transfer some APT to it** from your main account
3. **Export the private key** from the new account (easier since it's fresh)
4. **Use that for deployment**

This way your main account stays untouched!

---

## 📝 Common Locations in Petra:

- **Petra v1.x**: Settings → Security → Export Private Key
- **Petra v2.x**: Account Menu → Manage Account → Export Key
- **Latest version**: Three dots → Account Details → Show Private Key

---

## ✅ Once You Have It:

Just run this command (I'll wait):

\`\`\`powershell
cd c:\Users\pramo\Music\aptos\move
aptos init --profile mywallet --private-key YOUR_PRIVATE_KEY --network testnet
\`\`\`

Then tell me "imported" and I'll deploy everything!

---

## 🎯 Still Can't Find It?

Try this:
1. Update Petra wallet to latest version
2. Or tell me and we'll use the CLI-generated account instead (I'll fund it for you)

Let me know what works! 🚀
