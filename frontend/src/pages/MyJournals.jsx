import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Eye, DollarSign, Trash2, CheckCircle } from 'lucide-react';
import { useAptosWallet } from '../contexts/WalletContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import toast from 'react-hot-toast';

const MyJournals = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const { getJournal, getJournalContent, reclaimJournal, getPlatformStats } = useAptosWallet();
  const { account, connected } = useWallet();

  useEffect(() => {
    console.log('=== MyJournals useEffect triggered ===');
    console.log('connected:', connected);
    console.log('account:', account);
    console.log('window.aptos:', window.aptos);
    
    // Always try to load if window.aptos exists
    loadMyJournals();
  }, [connected, account]);

  const loadMyJournals = async () => {
    console.log('=== loadMyJournals called ===');
    console.log('Connected:', connected);
    console.log('Account:', account);
    
    // Try to get wallet using both methods
    let walletAccount = account;
    if (!walletAccount && window.aptos) {
      try {
        walletAccount = await window.aptos.account();
        console.log('Got wallet from window.aptos:', walletAccount);
      } catch (error) {
        console.error('Failed to get wallet from window.aptos:', error);
      }
    }
    
    if (!walletAccount) {
      console.log('❌ Wallet not connected - showing empty state');
      setLoading(false);
      toast('Please connect your wallet to view your journals', { icon: 'ℹ️' });
      return;
    }

    setLoading(true);
    console.log('=== Starting to load journals ===');
    console.log('Connected wallet address:', walletAccount.address);
    
    try {     
      const userJournals = [];
      
      // Get platform stats first to know how many journals exist
      console.log('Getting platform stats...');
      const stats = await getPlatformStats();
      console.log('Platform stats:', stats);
      const totalJournals = parseInt(stats.totalJournals) || 0;
      console.log(`Total journals on platform: ${totalJournals}`);
      
      if (totalJournals === 0) {
        console.log('No journals exist on platform yet');
        setJournals([]);
        setLoading(false);
        toast('No journals exist yet. Be the first to create one!', { icon: 'ℹ️' });
        return;
      }
      
      // Load all journals and filter by owner
      for (let i = 0; i < totalJournals; i++) {
        try {
          console.log(`Attempting to fetch journal ${i}...`);
          const journal = await getJournal(i);
          console.log(`Journal ${i} data:`, journal);
          
          if (journal && journal.length >= 6) {
            const journalOwner = String(journal[1]).toLowerCase();
            const userAddress = String(walletAccount.address).toLowerCase();
            
            console.log(`Journal ${i} owner: ${journalOwner}`);
            console.log(`Your address: ${userAddress}`);
            console.log(`Match: ${journalOwner === userAddress}`);
            
            if (journalOwner === userAddress) {
              console.log(`✅ Found your journal ${i}!`);
              userJournals.push({
                id: String(journal[0]),
                owner: journal[1],
                title: journal[2],
                totalReads: String(journal[3]),
                totalEarned: String(journal[4]),
                isActive: journal[5]
              });
            }
          }
        } catch (error) {
          console.log(`Journal ${i} doesn't exist or error:`, error.message);
          // Continue to next journal
        }
      }
      
      console.log(`=== Search complete. Found ${userJournals.length} journals ===`);
      setJournals(userJournals);
      
      if (userJournals.length === 0) {
        toast('You haven\'t created any journals yet. Go to "Add Journal" to create one!', { icon: 'ℹ️' });
      } else {
        toast.success(`Found ${userJournals.length} journal(s)`);
      }
    } catch (error) {
      console.error('=== FATAL ERROR loading journals ===');
      console.error(error);
      toast.error('Failed to load journals: ' + error.message);
    } finally {
      console.log('=== Finished loading, setting loading to false ===');
      setLoading(false);
    }
  };

  const handleViewContent = async (journalId) => {
    try {
      const content = await getJournalContent(journalId);
      console.log('=== Journal Content Retrieved ===');
      console.log('Journal ID:', journalId);
      console.log('Content:', content);
      console.log('Content type:', typeof content);
      console.log('Content length:', content?.length);
      setSelectedJournal({ id: journalId, content });
    } catch (error) {
      console.error('Failed to load journal content:', error);
      toast.error('Failed to load journal content');
    }
  };

  const handleReclaim = async (journalId) => {
    if (!confirm('Are you sure you want to reclaim this journal? It will be deactivated.')) {
      return;
    }

    try {
      await reclaimJournal(account, journalId);
      toast.success('Journal reclaimed successfully!');
      await loadMyJournals(); // Reload list
    } catch (error) {
      console.error('Failed to reclaim journal:', error);
      toast.error('Failed to reclaim journal');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4" />
          <p className="text-gray-400">Loading your journals...</p>
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
            <BookOpen className="w-10 h-10 text-primary-500 mr-4" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">My Journals</h1>
              <p className="text-dark-300 mt-2">Manage your journal entries</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-dark-400 text-sm">Total Journals</p>
            <p className="text-3xl font-bold text-primary-500">{journals.length}</p>
          </div>
        </div>

        {journals.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Journals Yet</h3>
            <p className="text-dark-300 mb-6">
              Start creating your first journal entry
            </p>
            <a href="/add-journal" className="btn-primary inline-block">
              Create Journal
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.map((journal, index) => (
              <motion.div
                key={journal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold flex-1 pr-2">{journal.title}</h3>
                  {journal.isActive ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between text-dark-300">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Total Reads
                    </span>
                    <span className="font-bold">{journal.totalReads.toString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-dark-300">
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Total Earned
                    </span>
                    <span className="font-bold text-primary-500">
                      {(parseInt(journal.totalEarned) / 100000000).toFixed(4)} APT
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewContent(journal.id)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View
                  </button>
                  
                  {journal.isActive && (
                    <button
                      onClick={() => handleReclaim(journal.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Reclaim
                    </button>
                  )}
                </div>
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
                <h2 className="text-2xl font-bold gradient-text">Journal Content</h2>
                <button
                  onClick={() => setSelectedJournal(null)}
                  className="text-dark-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-dark-200 whitespace-pre-wrap">{selectedJournal.content}</p>
              </div>
              
              <button
                onClick={() => setSelectedJournal(null)}
                className="btn-primary w-full mt-6"
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

export default MyJournals;
