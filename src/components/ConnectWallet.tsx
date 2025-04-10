
import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../lib/web3';
import { Droplet, PlusCircle, ExternalLink, Fuel } from 'lucide-react';

const ConnectWallet: React.FC = () => {
  const { connected, account, loading, connectWallet, chainId, refreshData } = useWeb3();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  useEffect(() => {
    setIsCorrectNetwork(chainId === '0x1bb');
  }, [chainId]);

  useEffect(() => {
    if (connected && isCorrectNetwork) {
      // Ensure complete data refresh when wallet connects and network is correct
      refreshData();
    }
  }, [connected, isCorrectNetwork, refreshData]);

  const addTENNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x1bb', // 443 in hex
          chainName: 'TEN Network',
          nativeCurrency: {
            name: 'TEN',
            symbol: 'TEN',
            decimals: 18
          },
          rpcUrls: ['https://testnet.ten.xyz'],
          blockExplorerUrls: ['https://tenscan.io']
        }]
      });
    } catch (error) {
      console.error('Error adding TEN network:', error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-3">
      {connected && (
        <div className={`multicolor-border-${isCorrectNetwork ? 'teal-green' : 'orange-pink'} rounded-full px-4 py-2 flex items-center justify-center group bg-cyber-black bg-opacity-80 backdrop-blur-lg relative overflow-hidden transition-all duration-300 ${isCorrectNetwork ? 'hover:shadow-[0_0_10px_rgba(0,255,65,0.4)]' : ''}`}>
          {isCorrectNetwork && (
            <div className="half-filled-fluid"></div>
          )}
          <Fuel className="w-4 h-4 mr-2 relative z-10 group-hover:text-black" />
          <span className="text-white text-sm relative z-10 group-hover:text-black">
            {isCorrectNetwork ? (
              <a 
                href="https://faucet.ten.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                TEN Network
              </a>
            ) : (
              <>
                Wrong Network
                {chainId && <span className="ml-1 opacity-70">({chainId})</span>}
              </>
            )}
          </span>
          
          {!isCorrectNetwork && (
            <a 
              href="https://gateway.ten.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center text-xs text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 active:from-orange-700 active:to-pink-700 px-2 py-1 rounded-full z-10 relative transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Add TEN
            </a>
          )}
          
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-10 z-0"></div>
        </div>
      )}

      {connected ? (
        <div className="multicolor-border-purple-blue rounded-full px-4 py-2 flex items-center justify-center group cursor-pointer bg-cyber-black bg-opacity-80 backdrop-blur-lg">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse-soft mr-2"></div>
          <span className="text-white text-sm truncate max-w-[120px] sm:max-w-[150px]">
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
          </span>
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-10"></div>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="multicolor-border-blue-purple rounded-full px-4 py-2 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 bg-cyber-black bg-opacity-80 backdrop-blur-lg"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-white text-sm">Connecting...</span>
            </div>
          ) : (
            <>
              <span className="text-white text-sm">Connect Wallet</span>
              <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-30 transition-opacity duration-300 bg-white"></div>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
