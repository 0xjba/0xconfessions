
import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../lib/web3';
import { Network, PlusCircle, ExternalLink } from 'lucide-react';

const ConnectWallet: React.FC = () => {
  const { connected, account, loading, connectWallet, chainId } = useWeb3();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  useEffect(() => {
    setIsCorrectNetwork(chainId === '0x1bb');
  }, [chainId]);

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
          rpcUrls: ['https://rpc.ten.xyz'],
          blockExplorerUrls: ['https://tenscan.io']
        }]
      });
    } catch (error) {
      console.error('Error adding TEN network:', error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-3">
      {/* Network Status Pill */}
      {connected && (
        <div className={`multicolor-border-${isCorrectNetwork ? 'teal-green' : 'orange-pink'} rounded-full px-4 py-2 flex items-center justify-center group cursor-pointer bg-cyber-black bg-opacity-80 backdrop-blur-lg relative`}>
          <Network className="w-4 h-4 mr-2" />
          <span className="text-white text-sm">
            {isCorrectNetwork ? 'TEN Network' : (
              <>
                Wrong Network
                {chainId && <span className="ml-1 opacity-70">({chainId})</span>}
              </>
            )}
          </span>
          
          {/* Add TEN Link - Now positioned with z-index to ensure it's clickable */}
          {!isCorrectNetwork && (
            <a 
              href="https://testnet.ten.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center text-xs text-white bg-gradient-to-r from-orange-500 to-pink-500 px-2 py-1 rounded-full z-10 relative"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Add TEN
            </a>
          )}
          
          {/* Hover effect background - now behind the Add TEN button */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-10 z-0"></div>
        </div>
      )}

      {/* Connect Wallet Pill */}
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
