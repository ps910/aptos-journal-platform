# Aptos Journal - Decentralized Journal Platform

A fullstack blockchain application built on the Aptos blockchain that allows users to create, read, and manage journal entries with cryptocurrency transactions.

## 🚀 Features

- **Petra Wallet Integration**: Seamlessly connect your Petra wallet for secure transactions
- **Create Journals**: Pay 0.1 APT to create permanent journal entries on the blockchain
- **Earn from Reads**: Earn 0.05 APT whenever someone reads your journal
- **Reclaim Journals**: Deactivate journals and get your initial fee back anytime
- **Transaction History**: View all transactions on Aptos Explorer
- **User Authentication**: Secure registration and login system
- **Responsive Design**: Modern, mobile-first UI with Tailwind CSS
- **Real-time Updates**: Live blockchain data integration

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Aptos SDK & Wallet Adapter
- React Router for navigation
- Axios for API calls

### Backend
- Node.js & Express
- MongoDB for user data
- JWT authentication
- Bcrypt for password hashing

### Blockchain
- Aptos Move smart contracts
- Petra Wallet integration
- Aptos Testnet

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Aptos CLI
- Petra Wallet browser extension
- Git

## 🔧 Installation

### 1. Clone the Repository

\`\`\`bash
cd aptos
\`\`\`

### 2. Install Dependencies

\`\`\`bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
\`\`\`

### 3. Set Up Environment Variables

#### Backend (.env)
\`\`\`bash
cd backend
cp .env.example .env
\`\`\`

Edit `backend/.env`:
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aptos-journal
JWT_SECRET=your-super-secret-jwt-key-change-this
\`\`\`

#### Frontend (.env)
\`\`\`bash
cd frontend
cp .env.example .env
\`\`\`

Edit `frontend/.env`:
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_APTOS_NETWORK=testnet
VITE_MODULE_ADDRESS=YOUR_DEPLOYED_MODULE_ADDRESS
\`\`\`

### 4. Deploy Smart Contract

#### Install Aptos CLI
\`\`\`bash
# On macOS/Linux
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# On Windows (PowerShell)
iwr "https://aptos.dev/scripts/install_cli.py" -useb | Select-Object -ExpandProperty Content | python
\`\`\`

#### Initialize Aptos Account
\`\`\`bash
cd move
aptos init --network testnet
\`\`\`

This will create a `.aptos/config.yaml` file with your account information.

#### Update Move.toml
Edit `move/Move.toml` and replace `journal_platform = "_"` with your account address:
\`\`\`toml
[addresses]
journal_platform = "0xYOUR_ACCOUNT_ADDRESS"
\`\`\`

#### Compile and Deploy
\`\`\`bash
# Compile the contract
aptos move compile

# Deploy to testnet
aptos move publish --named-addresses journal_platform=YOUR_ACCOUNT_ADDRESS
\`\`\`

#### Initialize the Platform
After deployment, you need to initialize the platform:
\`\`\`bash
aptos move run --function-id 'YOUR_ADDRESS::journal::initialize'
\`\`\`

### 5. Update Frontend Configuration

Update `frontend/src/contexts/WalletContext.jsx`:
\`\`\`javascript
const MODULE_ADDRESS = 'YOUR_DEPLOYED_MODULE_ADDRESS';
\`\`\`

## 🚀 Running the Application

### Development Mode

Run both frontend and backend concurrently:
\`\`\`bash
# From root directory
npm run dev
\`\`\`

Or run separately:

**Backend:**
\`\`\`bash
cd backend
npm run dev
# Server runs on http://localhost:5000
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm run dev
# App runs on http://localhost:3000
\`\`\`

### Production Build

**Frontend:**
\`\`\`bash
cd frontend
npm run build
npm run preview
\`\`\`

**Backend:**
\`\`\`bash
cd backend
npm start
\`\`\`

## 📱 Usage Guide

### 1. Install Petra Wallet
- Install the [Petra Wallet](https://petra.app/) browser extension
- Create a new wallet or import existing one
- Switch to Testnet network
- Get test APT from the [faucet](https://aptoslabs.com/testnet-faucet)

### 2. Register Account
- Visit http://localhost:3000
- Click "Get Started" and create an account
- Login with your credentials

### 3. Connect Wallet
- Click "Connect Wallet" in the navigation
- Approve the connection in Petra Wallet

### 4. Create Journal
- Navigate to "Add Journal"
- Write your journal title and content
- Pay 0.1 APT to publish
- Your journal is now on the blockchain!

### 5. Explore & Read
- Browse journals in "Explore" section
- Pay 0.05 APT to unlock and read journals
- Authors earn automatically when you read

### 6. Manage Journals
- View your journals in "My Journals"
- See total reads and earnings
- Reclaim your 0.1 APT fee by deactivating

## 🔐 Smart Contract Functions

### Main Functions

- `initialize(account)`: Initialize the platform (admin only)
- `add_journal(account, platform_address, title, content)`: Create a new journal (0.1 APT fee)
- `read_journal(account, platform_address, journal_id)`: Read a journal (0.05 APT to author)
- `reclaim_journal(account, platform_address, journal_id)`: Deactivate and reclaim fee

### View Functions

- `get_journal(platform_address, journal_id)`: Get journal metadata
- `get_journal_content(platform_address, journal_id)`: Get journal content
- `get_platform_stats(platform_address)`: Get platform statistics
- `has_read_journal(reader_address, journal_id)`: Check if user has read a journal

## 📊 Architecture

\`\`\`
┌─────────────────┐
│   React Frontend │
│   (Port 3000)   │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐ ┌─────▼──────────┐
│  Express API    │ │  Aptos Blockchain│
│  (Port 5000)    │ │  (Testnet)      │
└────────┬────────┘ └─────┬──────────┘
         │                │
    ┌────▼─────┐    ┌────▼─────┐
    │ MongoDB  │    │  Move    │
    │          │    │ Contract │
    └──────────┘    └──────────┘
\`\`\`

## 🧪 Testing

### Test the Smart Contract
\`\`\`bash
cd move
aptos move test
\`\`\`

### Manual Testing Flow
1. Create test accounts with test APT
2. Initialize platform
3. Create journals from different accounts
4. Test reading journals
5. Test reclaiming journals
6. Verify transactions on Aptos Explorer

## 📝 Project Structure

\`\`\`
aptos/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                # Express backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   └── package.json
├── move/                  # Aptos Move contracts
│   ├── sources/
│   │   └── journal.move   # Main contract
│   └── Move.toml
└── README.md
\`\`\`

## 🔍 Troubleshooting

### Common Issues

**1. Wallet Connection Fails**
- Ensure Petra Wallet is installed and unlocked
- Check that you're on Testnet network
- Refresh the page and try again

**2. Transaction Fails**
- Verify you have sufficient APT balance
- Check gas fees are available
- Ensure smart contract is properly deployed

**3. Contract Not Found**
- Verify MODULE_ADDRESS is correctly set
- Check contract is deployed on testnet
- Confirm initialization was successful

**4. MongoDB Connection Error**
- Ensure MongoDB is running locally
- Check connection string in .env
- Verify port 27017 is not in use

## 🌐 Resources

- [Aptos Documentation](https://aptos.dev/)
- [Petra Wallet](https://petra.app/)
- [Aptos Explorer](https://explorer.aptoslabs.com/)
- [Aptos Testnet Faucet](https://aptoslabs.com/testnet-faucet)
- [Move Language](https://move-language.github.io/move/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Aptos Labs for the blockchain platform
- Petra Wallet team for the wallet integration
- The Move language community

## 📧 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the Aptos Discord community
- Review the documentation

---

Built with ❤️ on Aptos Blockchain
\`\`\`
