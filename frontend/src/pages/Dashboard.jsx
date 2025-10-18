import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, PlusCircle, Wallet, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAptosWallet } from '../contexts/WalletContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { balance, fetchBalance, getPlatformStats } = useAptosWallet();
  const [stats, setStats] = useState({
    totalJournals: '0',
    platformBalance: '0'
  });
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isCheckingWallet, setIsCheckingWallet] = useState(false);

  useEffect(() => {
    checkWallet();
    loadPlatformStats();
    
    // Check wallet every 5 seconds (reduced from 2 to reduce spam)
    const intervalId = setInterval(() => {
      if (!isCheckingWallet) {
        checkWallet();
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [isCheckingWallet]);

  const checkWallet = async () => {
    if (isCheckingWallet) {
      console.log('Already checking wallet, skipping...');
      return;
    }
    
    setIsCheckingWallet(true);
    console.log('Checking wallet connection...');
    
    if (window.aptos) {
      try {
        const account = await window.aptos.account();
        if (account) {
          console.log('Wallet connected:', account.address);
          setWalletConnected(true);
          setWalletAddress(account.address);
          await fetchBalance(account.address);
          console.log('Balance fetched for:', account.address);
        }
      } catch (error) {
        console.log('Wallet not connected:', error.message);
      }
    }
    
    setIsCheckingWallet(false);
  };

  const loadPlatformStats = async () => {
    try {
      const platformStats = await getPlatformStats();
      setStats(platformStats);
    } catch (error) {
      console.error('Failed to load platform stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'Add Journal',
      description: 'Create a new journal entry',
      icon: <PlusCircle className="w-8 h-8" />,
      link: '/add-journal',
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'My Journals',
      description: 'View your journal entries',
      icon: <BookOpen className="w-8 h-8" />,
      link: '/my-journals',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Explore',
      description: 'Discover other journals',
      icon: <Users className="w-8 h-8" />,
      link: '/explore',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Transactions',
      description: 'View transaction history',
      icon: <TrendingUp className="w-8 h-8" />,
      link: '/transactions',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.username}</span>! 👋
        </h1>
        <p className="text-dark-300 text-lg">
          Manage your decentralized journals and track your earnings
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Wallet Balance</p>
              <p className="text-2xl font-bold">
                {walletConnected ? `${balance} APT` : 'Not Connected'}
              </p>
            </div>
            <Wallet className="w-10 h-10 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Total Journals</p>
              <p className="text-2xl font-bold">{stats.totalJournals}</p>
            </div>
            <BookOpen className="w-10 h-10 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Platform Balance</p>
              <p className="text-2xl font-bold">
                {((Number(stats.platformBalance) || 0) / 100000000).toFixed(2)} APT
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Status</p>
              <p className="text-2xl font-bold">
                {walletConnected ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-yellow-500">Connect Wallet</span>
                )}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to={action.link}
                className={`block h-full bg-gradient-to-br ${action.color} rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <div className="text-white">
                  <div className="mb-4">{action.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                  <p className="text-white/90">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 card"
      >
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-primary-500 font-bold text-lg mb-2">1. Create Journal</div>
            <p className="text-dark-300">
              Pay 0.1 APT to create a new journal entry. Your content is stored on the Aptos blockchain.
            </p>
          </div>
          <div>
            <div className="text-primary-500 font-bold text-lg mb-2">2. Earn from Reads</div>
            <p className="text-dark-300">
              When others unlock and read your journal, you earn 0.05 APT per read automatically.
            </p>
          </div>
          <div>
            <div className="text-primary-500 font-bold text-lg mb-2">3. Reclaim Anytime</div>
            <p className="text-dark-300">
              Deactivate your journal entry and get your initial 0.1 APT fee back whenever you want.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
