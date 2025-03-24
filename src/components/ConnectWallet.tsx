
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../lib/web3';
import NetworkWarning from './NetworkWarning';

const ConnectWallet: React.FC = () => {
  const { connected, account, loading, connectWallet, isCorrectNetwork } = useWeb3();
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);
  
  // Check network when connected
  useEffect(() => {
    if (connected && !isCorrectNetwork) {
      setShowNetworkWarning(true);
    } else {
      setShowNetworkWarning(false);
    }
  }, [connected, isCorrectNetwork]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {connected ? (
          <div className="multicolor-border-purple-blue rounded-full px-4 py-2 flex items-center justify-center group cursor-pointer bg-cyber-black bg-opacity-80 backdrop-blur-lg">
            <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-white' : 'bg-red-500'} animate-pulse-soft mr-2`}></div>
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
      
      <NetworkWarning 
        open={showNetworkWarning} 
        onOpenChange={setShowNetworkWarning} 
      />
    </>
  );
};

export default ConnectWallet;
