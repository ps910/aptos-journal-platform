import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, PlusCircle, Wallet, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAptosWallet } from '../contexts/WalletContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Dashboard = () => {
  useScrollAnimation();
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
    
    if (!window.aptos) {
      console.warn('⚠️ Aptos wallet extension not detected');
      console.log('Please install Petra Wallet or similar Aptos wallet extension');
      setWalletConnected(false);
      setIsCheckingWallet(false);
      return;
    }
    
    try {
      const account = await window.aptos.account();
      if (account && account.address) {
        console.log('✅ Wallet connected:', account.address);
        setWalletConnected(true);
        setWalletAddress(account.address);
        await fetchBalance(account.address);
        console.log('Balance fetched for:', account.address);
      } else {
        console.log('No account found - wallet may be locked');
        setWalletConnected(false);
      }
    } catch (error) {
      console.log('❌ Wallet connection error:', error.message);
      setWalletConnected(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-light text-dark-900 mb-2">
          Welcome back, <span className="font-semibold text-primary-700">{user?.username}</span>
        </h1>
        <p className="text-dark-600 text-lg">
          Manage your decentralized journals and track your earnings
        </p>
      </motion.div>

      {/* Wallet Warning */}
      {!walletConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-lg bg-accent-50 border border-accent-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-700 font-semibold">Wallet Not Connected</p>
              <p className="text-accent-600 text-sm mt-1">
                To create and manage journals, you need to connect your Aptos wallet (Petra Wallet recommended)
              </p>
            </div>
            <a
              href="https://petra.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-4 py-2 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition whitespace-nowrap"
            >
              Install Wallet
            </a>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="stagger-item">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="card glow-on-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-600 text-sm mb-1 font-medium">Wallet Balance</p>
                <p className="text-3xl font-light text-dark-900">
                  {walletConnected ? `${balance} APT` : '—'}
                </p>
              </div>
              <Wallet className="w-10 h-10 text-primary-700 opacity-60" />
            </div>
          </motion.div>
        </div>

        <div className="stagger-item">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="card glow-on-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-600 text-sm mb-1 font-medium">Total Journals</p>
                <p className="text-3xl font-light text-dark-900">{stats.totalJournals}</p>
              </div>
              <BookOpen className="w-10 h-10 text-primary-700 opacity-60" />
            </div>
          </motion.div>
        </div>

        <div className="stagger-item">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="card glow-on-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-600 text-sm mb-1 font-medium">Platform Balance</p>
                <p className="text-3xl font-light text-dark-900">
                  {((Number(stats.platformBalance) || 0) / 100000000).toFixed(2)} APT
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-primary-700 opacity-60" />
            </div>
          </motion.div>
        </div>

        <div className="stagger-item">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="card glow-on-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-600 text-sm mb-1 font-medium">Status</p>
                <p className="text-3xl font-light text-dark-900">
                  {walletConnected ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-dark-500">Pending</span>
                  )}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary-700 opacity-60" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-12 reveal"
      >
        <h2 className="text-3xl font-light text-dark-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div key={index} className="stagger-item">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(168, 152, 132, 0.2)' }}
              >
                <Link
                  to={action.link}
                  className="block h-full bg-white border border-dark-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="text-dark-900">
                    <div className="mb-4 text-primary-700">{action.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                    <p className="text-dark-600 text-sm">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="card reveal glow-on-hover"
      >
        <h2 className="text-3xl font-light text-dark-900 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="stagger-item"
          >
            <div className="text-primary-700 font-semibold text-lg mb-3">1. Create Journal</div>
            <p className="text-dark-600">
              Pay 0.1 APT to create a new journal entry. Your content is stored on the Aptos blockchain.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="stagger-item"
          >
            <div className="text-primary-700 font-semibold text-lg mb-3">2. Earn from Reads</div>
            <p className="text-dark-600">
              When others unlock and read your journal, you earn 0.05 APT per read automatically.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="stagger-item"
          >
            <div className="text-primary-700 font-semibold text-lg mb-3">3. Reclaim Anytime</div>
            <p className="text-dark-600">
              Deactivate your journal entry and get your initial 0.1 APT fee back whenever you want.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
