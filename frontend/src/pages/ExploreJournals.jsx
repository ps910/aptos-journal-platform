import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Lock, Eye, User } from 'lucide-react';
import { useAptosWallet } from '../contexts/WalletContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import toast from 'react-hot-toast';

const ExploreJournals = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(null);
  const { getJournal, getJournalContent, readJournal, getPlatformStats } = useAptosWallet();
  const { account, connected } = useWallet();

  useEffect(() => {
    loadAllJournals();
  }, []);

  const loadAllJournals = async () => {
    console.log('=== ExploreJournals: Starting to load all journals ===');
    setLoading(true);
    try {
      console.log('Fetching platform stats...');
      const stats = await getPlatformStats();
      console.log('Platform stats received:', stats);
      
      const totalJournals = parseInt(stats.totalJournals) || 0;
      console.log(`Total journals on platform: ${totalJournals}`);
      
      if (totalJournals === 0) {
        console.log('No journals exist yet');
        toast('No journals have been created yet. Be the first!', { icon: 'ℹ️' });
        setJournals([]);
        setLoading(false);
        return;
      }
      
      const allJournals = [];
      for (let i = 0; i < totalJournals; i++) {
        try {
          console.log(`Loading journal ${i}...`);
          const journal = await getJournal(i);
          console.log(`Journal ${i} data:`, journal);
          
          if (journal && journal[5]) { // Only active journals
            console.log(`✅ Adding active journal ${i} to list`);
            allJournals.push({
              id: String(journal[0]),
              owner: journal[1],
              title: journal[2],
              totalReads: String(journal[3]),
              totalEarned: String(journal[4]),
              isActive: journal[5]
            });
          } else {
            console.log(`⏭️ Skipping inactive journal ${i}`);
          }
        } catch (error) {
          console.error(`❌ Failed to load journal ${i}:`, error.message);
        }
      }
      
      console.log(`✅ Loaded ${allJournals.length} active journals`);
      setJournals(allJournals);
      
      if (allJournals.length === 0) {
        toast('No active journals found', { icon: 'ℹ️' });
      } else {
        toast.success(`Found ${allJournals.length} journal(s)`);
      }
    } catch (error) {
      console.error('=== FATAL ERROR loading journals ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      toast.error('Failed to load journals: ' + error.message);
      setJournals([]);
    } finally {
      console.log('=== Finished loading journals ===');
      setLoading(false);
    }
  };

  const handleReadJournal = async (journal) => {
    console.log('=== handleReadJournal called ===');
    console.log('connected:', connected);
    console.log('account:', account);
    console.log('window.aptos:', window.aptos);
    
    // Check wallet connection using both methods
    const isConnected = connected || (window.aptos && window.aptos.isConnected);
    const walletAccount = account || (window.aptos && await window.aptos.account().catch(() => null));
    
    console.log('isConnected:', isConnected);
    console.log('walletAccount:', walletAccount);
    
    if (!isConnected || !walletAccount) {
      toast.error('Please connect your wallet first');
      console.error('Wallet not connected properly');
      return;
    }

    try {
      // Check if user is the owner
      const userAddress = walletAccount.address || walletAccount;
      console.log('User address:', userAddress);
      console.log('Journal owner:', journal.owner);
      
      if (userAddress.toLowerCase() === journal.owner.toLowerCase()) {
        // Owner can read for free
        console.log('Owner reading own journal - free');
        const content = await getJournalContent(journal.id);
        setSelectedJournal({ ...journal, content });
        toast.success('Viewing your own journal');
        return;
      }

      // Non-owner needs to pay
      console.log('Non-owner reading journal - payment required');
      console.log('Calling readJournal with payment...');
      
      // This will trigger Petra wallet popup for 0.05 APT payment
      await readJournal(walletAccount, journal.id);
      
      console.log('Payment confirmed, fetching content...');
      const content = await getJournalContent(journal.id);
      setSelectedJournal({ ...journal, content });
      
      // Toast is already shown in readJournal function
      
      // Reload journals to update stats
      await loadAllJournals();
    } catch (error) {
      console.error('Failed to read journal:', error);
      if (error.message?.includes('ALREADY_READ')) {
        toast.error('You have already read this journal');
      } else if (error.message?.includes('INSUFFICIENT_BALANCE')) {
        toast.error('Insufficient balance. You need at least 0.05 APT');
      } else {
        toast.error('Failed to read journal');
      }
    }
  };

  const filteredJournals = journals.filter(journal =>
    journal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center mb-8">
          <Search className="w-10 h-10 text-primary-500 mr-4" />
          <div>
            <h1 className="text-4xl font-bold gradient-text">Explore Journals</h1>
            <p className="text-dark-300 mt-2">Discover and read journals from the community</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="card mb-8 bg-primary-900/20 border-primary-700">
          <div className="flex items-start">
            <Lock className="w-6 h-6 text-primary-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">How Reading Works</h3>
              <ul className="text-dark-300 space-y-1">
                <li>• Pay <strong className="text-white">0.05 APT</strong> to unlock and read any journal</li>
                <li>• The fee goes directly to the journal's author</li>
                <li>• Once unlocked, you can read it anytime for free</li>
                <li>• Your own journals are always free to read</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
              placeholder="Search journals by title..."
            />
          </div>
        </div>

        {/* Journals Grid */}
        {filteredJournals.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Journals Found</h3>
            <p className="text-dark-300">
              {searchTerm ? 'Try a different search term' : 'Be the first to create a journal!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJournals.map((journal, index) => (
              <motion.div
                key={journal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:border-primary-500 cursor-pointer"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{journal.title}</h3>
                  <div className="flex items-center text-dark-400 text-sm">
                    <User className="w-4 h-4 mr-1" />
                    <span className="truncate">
                      {journal.owner.slice(0, 6)}...{journal.owner.slice(-4)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between text-dark-300">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Reads
                    </span>
                    <span className="font-bold">{journal.totalReads.toString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-dark-300">
                    <span className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Unlock Fee
                    </span>
                    <span className="font-bold text-primary-500">0.05 APT</span>
                  </div>
                </div>

                <button
                  onClick={() => handleReadJournal(journal)}
                  className="btn-primary w-full"
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Read Journal
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* View Content Modal */}
        {selectedJournal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold gradient-text">{selectedJournal.title}</h2>
                  <p className="text-sm text-dark-400 mt-1">
                    By: {selectedJournal.owner.slice(0, 10)}...{selectedJournal.owner.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedJournal(null)}
                  className="text-dark-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-dark-200 whitespace-pre-wrap">{selectedJournal.content}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg mb-4">
                <div className="text-sm text-dark-300">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Total Reads: <span className="font-bold ml-1">{selectedJournal.totalReads.toString()}</span>
                  </div>
                </div>
                <a
                  href={`https://explorer.aptoslabs.com/account/${selectedJournal.owner}?network=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-400 text-sm"
                >
                  View on Explorer →
                </a>
              </div>
              
              <button
                onClick={() => setSelectedJournal(null)}
                className="btn-primary w-full"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ExploreJournals;
