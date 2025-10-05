import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, ExternalLink, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      if (!window.aptos) {
        toast.error('Please connect your Petra wallet');
        setLoading(false);
        return;
      }

      const account = await window.aptos.account();
      setWalletAddress(account.address);

      // Fetch transactions from Aptos node
      const response = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${account.address}/transactions?limit=50`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      
      // Filter and format transactions
      const formattedTransactions = data
        .filter(tx => tx.success && tx.type === 'user_transaction')
        .map(tx => ({
          hash: tx.hash,
          timestamp: new Date(parseInt(tx.timestamp) / 1000).toLocaleString(),
          type: determineTransactionType(tx, account.address),
          amount: extractAmount(tx),
          status: tx.success ? 'success' : 'failed',
          version: tx.version
        }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const determineTransactionType = (tx, address) => {
    const payload = tx.payload;
    if (!payload || !payload.function) return 'Unknown';

    if (payload.function.includes('add_journal')) return 'Create Journal';
    if (payload.function.includes('read_journal')) return 'Read Journal';
    if (payload.function.includes('reclaim_journal')) return 'Reclaim Journal';
    if (payload.function.includes('transfer')) return 'Transfer';
    
    return 'Other';
  };

  const extractAmount = (tx) => {
    // Try to extract amount from events
    if (tx.events && tx.events.length > 0) {
      for (const event of tx.events) {
        if (event.type.includes('WithdrawEvent') && event.data.amount) {
          return (parseInt(event.data.amount) / 100000000).toFixed(4);
        }
      }
    }
    return '-';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Create Journal':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'Read Journal':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'Reclaim Journal':
        return <ArrowDownRight className="w-5 h-5 text-green-500" />;
      default:
        return <ArrowUpRight className="w-5 h-5 text-dark-400" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <History className="w-10 h-10 text-primary-500 mr-4" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Transaction History</h1>
              <p className="text-dark-300 mt-2">View all your blockchain transactions</p>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        {walletAddress && (
          <div className="card mb-8 bg-primary-900/20 border-primary-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-dark-400 text-sm mb-1">Your Wallet Address</p>
                <p className="font-mono text-lg">{walletAddress}</p>
              </div>
              <a
                href={`https://explorer.aptoslabs.com/account/${walletAddress}?network=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center"
              >
                View on Explorer
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        )}

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="card text-center py-12">
            <History className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
            <p className="text-dark-300">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:border-primary-500 transition-all"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">{getTypeIcon(tx.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold">{tx.type}</h3>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded text-xs">
                          {tx.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-dark-300">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {tx.timestamp}
                        </div>
                        <div className="font-mono truncate">
                          Hash: {tx.hash.slice(0, 20)}...{tx.hash.slice(-20)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    {tx.amount !== '-' && (
                      <div className="text-right">
                        <p className="text-sm text-dark-400">Amount</p>
                        <p className="text-xl font-bold text-primary-500">
                          {tx.amount} APT
                        </p>
                      </div>
                    )}
                    <a
                      href={`https://explorer.aptoslabs.com/txn/${tx.version}?network=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm py-2 px-4 flex items-center"
                    >
                      View Details
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={loadTransactions}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Loading...' : 'Refresh Transactions'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionHistory;
