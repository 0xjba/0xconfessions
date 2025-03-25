
import { useState, useEffect, useCallback } from 'react';
import { CONFESSIONS_ABI } from './contractABI';
import { CONFESSIONS_CONTRACT_ADDRESS } from '../config/contracts';
import { toast } from "sonner";

export interface Confession {
  id: number;
  text: string;
  timestamp: number;
  upvotes: number;
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
  const [topConfessions, setTopConfessions] = useState<Confession[]>([]);
  const [totalConfessions, setTotalConfessions] = useState<number>(0);
  const [chainId, setChainId] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const handleChainChanged = (_chainId: string) => {
        window.location.reload();
      };
      
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);
          checkChainId().then(id => {
            if (id === '0x1bb') {
              setupContract().then(() => {
                refreshData();
              });
            }
          });
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

  useEffect(() => {
    if (connected && chainId === '0x1bb') {
      setupContract().then(() => {
        // Make sure to refresh all data when connected to the right network
        refreshData();
      });
    }
  }, [connected, chainId]);

  const checkChainId = async () => {
    if (window.ethereum) {
      try {
        const currentChain = await window.ethereum.request({ method: 'eth_chainId' });
        console.log(currentChain + ' <- currentChain');
        setChainId(currentChain);
        return currentChain;
      } catch (error) {
        console.error("Failed to get chain ID:", error);
        return null;
      }
    }
    return null;
  };

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);
          const currentChain = await checkChainId();
          if (currentChain === '0x1bb') {
            await setupContract();
          }
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
        const currentChain = await checkChainId();
        if (currentChain === '0x1bb') {
          const contractInstance = await setupContract();
          // Immediately fetch all confessions data when wallet connects to correct network
          if (contractInstance) {
            await refreshData();
          }
        }
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
      // Make sure we have a valid contract address
      if (!CONFESSIONS_CONTRACT_ADDRESS) {
        console.error("Contract address is not defined");
        return;
      }
      
      const ethersProvider = new (await import('ethers')).BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      const contractInstance = new (await import('ethers')).Contract(
        CONFESSIONS_CONTRACT_ADDRESS,
        CONFESSIONS_ABI,
        signer
      );
      
      setProvider(ethersProvider);
      setContract(contractInstance);
      return contractInstance;
    } catch (error) {
      console.error("Error setting up contract:", error);
    }
  };

  const fetchConfessions = useCallback(async () => {
    // Don't proceed if we're not on TEN Network
    if (chainId !== '0x1bb') {
      setConfessions([]);
      return;
    }

    // Make sure we have a valid contract instance
    let contractInstance = contract;
    if (!contractInstance) {
      contractInstance = await setupContract();
      if (!contractInstance) {
        console.error("Cannot fetch confessions: Contract not initialized");
        return;
      }
    }

    try {
      const fetchCount = 20; // Fetch 20 latest confessions
      const result = await contractInstance.getRecentConfessions(fetchCount);
      
      const formattedConfessions: Confession[] = result.map((conf: any) => ({
        id: Number(conf.id),
        text: conf.text,
        timestamp: Number(conf.timestamp),
        upvotes: Number(conf.upvotes)
      }));

      setConfessions(formattedConfessions);
      console.log(`Fetched ${formattedConfessions.length} recent confessions`);
    } catch (error) {
      console.error("Error fetching confessions:", error);
      toast.error("Failed to load confessions");
    }
  }, [contract, chainId, setupContract]);

  const fetchTopConfessions = useCallback(async () => {
    if (chainId !== '0x1bb') {
      setTopConfessions([]);
      return;
    }
    
    // Make sure we have a valid contract instance
    let contractInstance = contract;
    if (!contractInstance) {
      contractInstance = await setupContract();
      if (!contractInstance) {
        console.error("Cannot fetch top confessions: Contract not initialized");
        return;
      }
    }
    
    try {
      const result = await contractInstance.getTopConfessions();
      
      const formattedTopConfessions: Confession[] = result.map((conf: any) => ({
        id: Number(conf.id),
        text: conf.text,
        timestamp: Number(conf.timestamp),
        upvotes: Number(conf.upvotes)
      }));

      setTopConfessions(formattedTopConfessions);
      console.log(`Fetched ${formattedTopConfessions.length} top confessions`);
    } catch (error) {
      console.error("Error fetching top confessions:", error);
    }
  }, [contract, chainId, setupContract]);

  const fetchTotalConfessions = useCallback(async () => {
    if (chainId !== '0x1bb') {
      // Reset counter if not on correct network
      setTotalConfessions(0);
      return;
    }
    
    // Make sure we have a valid contract instance
    let contractInstance = contract;
    if (!contractInstance) {
      contractInstance = await setupContract();
      if (!contractInstance) {
        console.error("Cannot fetch total confessions count: Contract not initialized");
        return;
      }
    }
    
    try {
      const count = await contractInstance.totalConfessionsCount();
      const countNumber = Number(count);
      setTotalConfessions(countNumber);
      console.log(`Total confessions count: ${countNumber}`);
    } catch (error) {
      console.error("Error fetching total confessions count:", error);
    }
  }, [contract, chainId, setupContract]);

  const refreshData = useCallback(async () => {
    console.log("Refreshing all confession data...");
    setLoading(true);
    try {
      await Promise.all([
        fetchConfessions(),
        fetchTopConfessions(),
        fetchTotalConfessions()
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchConfessions, fetchTopConfessions, fetchTotalConfessions]);

  const checkIfUserHasUpvoted = async (confessionId: number) => {
    if (!connected || chainId !== '0x1bb' || !contract) {
      return false;
    }

    try {
      const hasUpvoted = await contract.hasUserUpvoted(confessionId);
      return hasUpvoted;
    } catch (error) {
      console.error("Error checking if user has upvoted:", error);
      return false;
    }
  };

  const upvoteConfession = async (confessionId: number) => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (chainId !== '0x1bb') {
      toast.error("Please connect to TEN network (Chain ID: 443)");
      return;
    }

    // Make sure we have a valid contract instance
    if (!contract) {
      toast.error("Contract not initialized");
      return;
    }

    // Check if user has already upvoted
    const hasUpvoted = await checkIfUserHasUpvoted(confessionId);
    if (hasUpvoted) {
      toast.error("You've already upvoted this confession");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.upvoteConfession(confessionId);
      toast.success(`Upvoting confession #${confessionId}. Waiting for confirmation...`);
      
      await tx.wait();
      
      toast.success(`Upvote for confession #${confessionId} confirmed!`);
      
      // Immediately refresh data after upvoting
      await refreshData();
    } catch (error: any) {
      console.error("Error upvoting confession:", error);
      toast.error(error.message || "Failed to upvote confession");
    } finally {
      setLoading(false);
    }
  };

  const submitConfession = async (text: string) => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (chainId !== '0x1bb') {
      toast.error("Please connect to TEN network (Chain ID: 443)");
      return;
    }

    // Make sure we have a valid contract instance
    let contractInstance = contract;
    if (!contractInstance) {
      contractInstance = await setupContract();
      if (!contractInstance) {
        toast.error("Contract not initialized");
        return;
      }
    }

    try {
      setLoading(true);
      const tx = await contractInstance.confess(text);
      toast.success("Confession submitted! Waiting for confirmation...");
      
      const receipt = await tx.wait();
      
      // Find the ConfessionAdded event in the transaction logs
      const confessionEvent = receipt.logs
        .find((log: any) => log.fragment && log.fragment.name === 'ConfessionAdded');
      
      if (confessionEvent && confessionEvent.args) {
        const confessionId = Number(confessionEvent.args[0]);
        toast.success(`Confession #${confessionId} confirmed on the blockchain!`);
      } else {
        toast.success("Confession confirmed on the blockchain!");
      }
      
      // Immediately refresh all data after submitting
      await refreshData();
    } catch (error: any) {
      console.error("Error submitting confession:", error);
      toast.error(error.message || "Failed to submit confession");
    } finally {
      setLoading(false);
    }
  };

  const getConfessionById = async (id: number) => {
    if (!contract || chainId !== '0x1bb') {
      return null;
    }

    try {
      const [text, timestamp, upvotes] = await contract.getConfession(id);
      return {
        id,
        text,
        timestamp: Number(timestamp),
        upvotes: Number(upvotes)
      };
    } catch (error) {
      console.error("Error fetching confession by ID:", error);
      return null;
    }
  };

  return {
    connected,
    account,
    loading,
    confessions,
    topConfessions,
    totalConfessions,
    chainId,
    connectWallet,
    submitConfission: submitConfession, // Aliasing for backward compatibility if needed
    submitConfession,
    upvoteConfession,
    checkIfUserHasUpvoted,
    getConfessionById,
    refreshData
  };
};
