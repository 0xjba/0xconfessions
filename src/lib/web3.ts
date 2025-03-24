
import { useState, useEffect } from 'react';
import { CONFESSIONS_ABI, CONFESSIONS_CONTRACT_ADDRESS } from './contractABI';
import { toast } from "sonner";

export interface Confession {
  id: number;
  text: string;
  timestamp: number;
}

interface WindowWithEthereum extends Window {
  ethereum?: any;
}

declare const window: WindowWithEthereum;

export const useWeb3 = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [provider, setProvider] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [confessions, setConfessions] = useState<Confession[]>([]);

  // Check if wallet is connected
  useEffect(() => {
    checkConnection();
    
    // Handle account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);
        } else {
          setAccount(null);
          setConnected(false);
        }
      });
    }
    
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Fetch confessions when contract is available
  useEffect(() => {
    if (contract && connected) {
      fetchConfessions();
    }
  }, [contract, connected]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);
          setupContract();
        }
      } catch (error) {
        console.error("Failed to check connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("No Ethereum wallet found. Please install MetaMask or another wallet.");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setConnected(true);
        setupContract();
        toast.success("Wallet connected successfully!");
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const setupContract = async () => {
    if (!window.ethereum) return;

    try {
      // This is a simplified version. In a real app, you might use ethers.js or web3.js
      const ethersProvider = new (await import('ethers')).BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      const contractInstance = new (await import('ethers')).Contract(
        CONFESSIONS_CONTRACT_ADDRESS,
        CONFESSIONS_ABI,
        signer
      );
      
      setProvider(ethersProvider);
      setContract(contractInstance);
    } catch (error) {
      console.error("Error setting up contract:", error);
    }
  };

  const fetchConfessions = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      // Get total count
      const count = await contract.getConfessionCount();
      
      // Get recent confessions (up to 20)
      const fetchCount = Math.min(20, parseInt(count.toString()));
      if (fetchCount === 0) {
        setConfessions([]);
        return;
      }

      const result = await contract.getRecentConfessions(fetchCount);
      
      // Convert to our format
      const formattedConfessions: Confession[] = result.map((conf: any, index: number) => ({
        id: count - index - 1, // Latest confessions first
        text: conf.text,
        timestamp: Number(conf.timestamp)
      }));

      setConfessions(formattedConfessions);
    } catch (error) {
      console.error("Error fetching confessions:", error);
      toast.error("Failed to load confessions");
    } finally {
      setLoading(false);
    }
  };

  const submitConfession = async (text: string) => {
    if (!contract || !connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.confess(text);
      toast.success("Confession submitted! Waiting for confirmation...");
      
      // Wait for transaction confirmation
      await tx.wait();
      
      toast.success("Confession confirmed on the blockchain!");
      
      // Refresh the list
      await fetchConfessions();
    } catch (error: any) {
      console.error("Error submitting confession:", error);
      toast.error(error.message || "Failed to submit confession");
    } finally {
      setLoading(false);
    }
  };

  return {
    connected,
    account,
    loading,
    confessions,
    connectWallet,
    submitConfession,
    refreshConfessions: fetchConfessions
  };
};
