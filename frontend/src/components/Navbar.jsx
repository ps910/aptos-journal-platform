import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Wallet, LogOut, User, BookOpen, History, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { user, logout, updateWallet } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.aptos) {
      try {
        const account = await window.aptos.account();
        if (account) {
          setWalletAddress(account.address);
          setWalletConnected(true);
          await updateWallet(account.address);
        }
      } catch (error) {
        console.log('Wallet not connected');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.aptos) {
      toast.error('Please install Petra Wallet extension');
      window.open('https://petra.app/', '_blank');
      return;
    }

    try {
      const response = await window.aptos.connect();
      setWalletAddress(response.address);
      setWalletConnected(true);
      await updateWallet(response.address);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.aptos.disconnect();
      setWalletConnected(false);
      setWalletAddress('');
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold gradient-text">Aptos Journal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="text-dark-300 hover:text-primary-500 px-3 py-2 rounded-md transition">
              Dashboard
            </Link>
            <Link to="/add-journal" className="text-dark-300 hover:text-primary-500 px-3 py-2 rounded-md transition">
              Add Journal
            </Link>
            <Link to="/my-journals" className="text-dark-300 hover:text-primary-500 px-3 py-2 rounded-md transition">
              My Journals
            </Link>
            <Link to="/explore" className="text-dark-300 hover:text-primary-500 px-3 py-2 rounded-md transition">
              Explore
            </Link>
            <Link to="/transactions" className="text-dark-300 hover:text-primary-500 px-3 py-2 rounded-md transition">
              Transactions
            </Link>

            {/* Wallet Connection */}
            {walletConnected ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">{shortAddress}</span>
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-primary">
                <Wallet className="w-4 h-4 inline mr-2" />
                Connect Wallet
              </button>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-2 border-l border-dark-700 pl-4">
              <User className="w-5 h-5 text-dark-400" />
              <span className="text-sm text-dark-300">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-dark-400 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-dark-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-dark-300 hover:text-primary-500 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/add-journal"
              className="block px-3 py-2 text-dark-300 hover:text-primary-500 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Add Journal
            </Link>
            <Link
              to="/my-journals"
              className="block px-3 py-2 text-dark-300 hover:text-primary-500 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              My Journals
            </Link>
            <Link
              to="/explore"
              className="block px-3 py-2 text-dark-300 hover:text-primary-500 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/transactions"
              className="block px-3 py-2 text-dark-300 hover:text-primary-500 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Transactions
            </Link>

            {walletConnected ? (
              <button
                onClick={() => {
                  disconnectWallet();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-primary-500"
              >
                Disconnect: {shortAddress}
              </button>
            ) : (
              <button
                onClick={() => {
                  connectWallet();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-primary-500"
              >
                Connect Wallet
              </button>
            )}

            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
