import { createContext, useContext, useState, useEffect } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import toast from 'react-hot-toast';

const WalletContext = createContext(null);

export const useAptosWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useAptosWallet must be used within AptosWalletProvider');
  }
  return context;
};

// Module address - UPDATE THIS after deploying your contract
const MODULE_ADDRESS = '0xdf8185c47fe1be6c3bfceb8185da88769cfca09fc308cab61caa0a8b749c42b7';

// Initialize Aptos client with explicit fullnode URL
const config = new AptosConfig({ 
  network: Network.TESTNET,
  fullnode: 'https://fullnode.testnet.aptoslabs.com/v1'
});
const aptosClient = new Aptos(config);

// Test the connection immediately
(async () => {
  try {
    console.log('� Testing Aptos connection...');
    const ledgerInfo = await aptosClient.getLedgerInfo();
    console.log('✅ Aptos connected! Chain ID:', ledgerInfo.chain_id);
  } catch (error) {
    console.error('❌ Aptos connection failed:', error.message);
  }
})();

console.log('�🚀 Aptos client initialized with config:', {
  network: Network.TESTNET,
  fullnode: config.fullnode || config.network
});

export const AptosWalletProvider = ({ children }) => {
  const [balance, setBalance] = useState('0');

  const fetchBalance = async (address) => {
    console.log('=== fetchBalance called ===');
    console.log('Address:', address);
    
    if (!address) {
      console.error('No address provided');
      return;
    }
    
    try {
      console.log('Fetching account APT balance using getAccountAPTAmount...');
      
      // Try the direct method first
      const balanceAmount = await aptosClient.getAccountAPTAmount({ 
        accountAddress: address 
      });
      
      console.log('Raw balance (Octas):', balanceAmount);
      const balanceValue = (balanceAmount / 100000000).toFixed(4);
      console.log('✅ Balance calculated:', balanceValue, 'APT');
      setBalance(balanceValue);
      
    } catch (error) {
      console.error('❌ Error fetching balance:', error.message);
      
      // Try fallback method using resources
      try {
        console.log('Trying fallback method with getAccountResources...');
        const resources = await aptosClient.getAccountResources({ 
          accountAddress: address 
        });
        
        const coinResource = resources.find(
          (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
        );
        
        if (coinResource) {
          const balanceValue = (coinResource.data.coin.value / 100000000).toFixed(4);
          console.log('✅ Balance from fallback:', balanceValue, 'APT');
          setBalance(balanceValue);
        } else {
          console.warn('⚠️ No APT CoinStore found, setting balance to 0');
          setBalance('0');
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError.message);
        setBalance('0');
      }
    }
  };

  const addJournal = async (account, title, content) => {
    const payload = {
      function: `${MODULE_ADDRESS}::journal::add_journal`,
      type_arguments: [],
      arguments: [MODULE_ADDRESS, title, content]
    };

    try {
      const response = await window.aptos.signAndSubmitTransaction(payload);
      await aptosClient.waitForTransaction({ transactionHash: response.hash });
      toast.success('Journal added successfully!');
      return response;
    } catch (error) {
      console.error('Error adding journal:', error);
      toast.error('Failed to add journal');
      throw error;
    }
  };

  const readJournal = async (account, journalId) => {
    console.log('=== Reading Journal ===');
    console.log('Account:', account);
    console.log('Journal ID:', journalId);

    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::journal::read_journal`,
      type_arguments: [],
      arguments: [MODULE_ADDRESS, String(journalId)]
    };

    try {
      console.log('Requesting payment of 0.05 APT...');
      toast.loading('Please approve the transaction in Petra wallet (0.05 APT)...');
      
      const response = await window.aptos.signAndSubmitTransaction(payload);
      console.log('Transaction submitted:', response);
      
      toast.loading('Confirming payment on blockchain...');
      await aptosClient.waitForTransaction({ transactionHash: response.hash });
      
      console.log('✅ Payment confirmed!');
      toast.success('Payment successful! 0.05 APT sent to author');
      return response;
    } catch (error) {
      console.error('❌ Error reading journal:', error);
      
      if (error.message?.includes('User rejected')) {
        toast.error('Transaction cancelled');
      } else if (error.message?.includes('Insufficient')) {
        toast.error('Insufficient balance. You need at least 0.05 APT');
      } else {
        toast.error('Failed to read journal: ' + error.message);
      }
      throw error;
    }
  };

  const reclaimJournal = async (account, journalId) => {
    console.log('=== Reclaiming Journal ===');
    console.log('Account:', account);
    console.log('Journal ID:', journalId);

    const payload = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDRESS}::journal::reclaim_journal`,
      type_arguments: [],
      arguments: [MODULE_ADDRESS, String(journalId)]
    };

    try {
      const response = await window.aptos.signAndSubmitTransaction(payload);
      await aptosClient.waitForTransaction({ transactionHash: response.hash });
      toast.success('Journal reclaimed successfully!');
      return response;
    } catch (error) {
      console.error('Error reclaiming journal:', error);
      toast.error('Failed to reclaim journal');
      throw error;
    }
  };

  const getJournal = async (journalId) => {
    console.log(`getJournal called for ID: ${journalId}`);
    try {
      const result = await aptosClient.view({
        payload: {
          function: `${MODULE_ADDRESS}::journal::get_journal`,
          typeArguments: [],
          functionArguments: [MODULE_ADDRESS, String(journalId)]
        }
      });
      console.log(`getJournal ${journalId} result:`, result);
      return result;
    } catch (error) {
      console.error(`Error fetching journal ${journalId}:`, error.message);
      throw error;
    }
  };

  const getJournalContent = async (journalId) => {
    console.log(`getJournalContent called for ID: ${journalId}`);
    try {
      const result = await aptosClient.view({
        payload: {
          function: `${MODULE_ADDRESS}::journal::get_journal_content`,
          typeArguments: [],
          functionArguments: [MODULE_ADDRESS, String(journalId)]
        }
      });
      console.log(`getJournalContent ${journalId} result:`, result);
      return result[0];
    } catch (error) {
      console.error(`Error fetching journal content ${journalId}:`, error.message);
      throw error;
    }
  };

  const getPlatformStats = async () => {
    try {
      console.log('========== GET PLATFORM STATS ==========');
      console.log('MODULE_ADDRESS:', MODULE_ADDRESS);
      console.log('aptosClient:', aptosClient);
      console.log('Calling view function...');
      
      // Correct Aptos SDK v2 syntax for view function
      const result = await aptosClient.view({
        payload: {
          function: `${MODULE_ADDRESS}::journal::get_platform_stats`,
          typeArguments: [],
          functionArguments: [MODULE_ADDRESS]
        }
      });
      
      console.log('✅ Platform stats raw result:', result);
      console.log('Result type:', typeof result, 'Is Array:', Array.isArray(result));
      
      // Safely handle the result
      if (!result || !Array.isArray(result) || result.length < 2) {
        console.error('❌ Invalid platform stats result:', result);
        return { totalJournals: '0', platformBalance: '0' };
      }
      
      // Convert to strings safely - handle both string and number types
      const totalJournals = String(result[0] || '0');
      const platformBalance = String(result[1] || '0');
      
      console.log('✅ Parsed stats:', { totalJournals, platformBalance });
      console.log('==========================================');
      
      return { 
        totalJournals: totalJournals, 
        platformBalance: platformBalance 
      };
    } catch (error) {
      console.error('❌❌❌ CRITICAL ERROR fetching platform stats ❌❌❌');
      console.error('Error object:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error cause:', error.cause);
      // Return default values instead of throwing
      return { totalJournals: '0', platformBalance: '0' };
    }
  };

  const value = {
    aptosClient,
    balance,
    fetchBalance,
    addJournal,
    readJournal,
    reclaimJournal,
    getJournal,
    getJournalContent,
    getPlatformStats,
    MODULE_ADDRESS
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
