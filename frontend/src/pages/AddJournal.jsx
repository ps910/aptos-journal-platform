import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, BookOpen, DollarSign } from 'lucide-react';
import { useAptosWallet } from '../contexts/WalletContext';
import toast from 'react-hot-toast';

const AddJournal = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { addJournal } = useAptosWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.aptos) {
      toast.error('Please connect your Petra wallet first');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const account = await window.aptos.account();
      await addJournal(account, title, content);
      
      // Reset form
      setTitle('');
      setContent('');
      
      toast.success('Journal added successfully! 🎉');
    } catch (error) {
      console.error('Error adding journal:', error);
      if (error.message?.includes('INSUFFICIENT_BALANCE')) {
        toast.error('Insufficient balance. You need at least 0.1 APT');
      } else {
        toast.error('Failed to add journal. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center mb-8">
          <BookOpen className="w-10 h-10 text-primary-500 mr-4" />
          <div>
            <h1 className="text-4xl font-bold gradient-text">Create New Journal</h1>
            <p className="text-dark-300 mt-2">Share your thoughts on the blockchain</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="card mb-8 bg-primary-900/20 border-primary-700">
          <div className="flex items-start">
            <DollarSign className="w-6 h-6 text-primary-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">Fee Information</h3>
              <ul className="text-dark-300 space-y-1">
                <li>• <strong className="text-white">Add Fee:</strong> 0.1 APT (paid once to create entry)</li>
                <li>• <strong className="text-white">Earn:</strong> 0.05 APT each time someone reads your journal</li>
                <li>• <strong className="text-white">Reclaim:</strong> Get your 0.1 APT back anytime by deactivating</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Journal Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Give your journal a meaningful title..."
                required
                maxLength={100}
              />
              <p className="text-sm text-dark-400 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Journal Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field min-h-[300px] resize-y"
                placeholder="Write your journal entry here... Share your experiences, thoughts, or stories that others might find valuable."
                required
                maxLength={5000}
              />
              <p className="text-sm text-dark-400 mt-1">
                {content.length}/5000 characters
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
              <div className="text-dark-300">
                <p className="text-sm">You will be charged:</p>
                <p className="text-2xl font-bold text-primary-500">0.1 APT</p>
              </div>
              
              <button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Publish Journal
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 card bg-dark-900/50"
        >
          <h3 className="font-bold text-lg mb-4">💡 Tips for Great Journals</h3>
          <ul className="space-y-2 text-dark-300">
            <li>✓ Write clear, engaging titles that attract readers</li>
            <li>✓ Share valuable insights or unique experiences</li>
            <li>✓ Keep your content well-structured and easy to read</li>
            <li>✓ The more people read, the more you earn!</li>
            <li>✓ You can reclaim your fee anytime by deactivating the journal</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddJournal;
