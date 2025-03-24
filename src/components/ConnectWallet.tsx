
import React from 'react';
import { useWeb3 } from '../lib/web3';

const ConnectWallet: React.FC = () => {
  const { connected, account, loading, connectWallet } = useWeb3();

  return (
    <div className="fixed top-4 right-4 z-50">
      {connected ? (
        <div className="cyber-pill flex items-center justify-center group cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-soft mr-2"></div>
          <span className="cyber-text text-sm truncate max-w-[120px] sm:max-w-[150px]">
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
          </span>
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cyber-green bg-opacity-10"></div>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="cyber-pill flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-cyber-green border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="cyber-text text-sm">Connecting...</span>
            </div>
          ) : (
            <>
              <span className="cyber-text text-sm">Connect Wallet</span>
              <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-30 transition-opacity duration-300 bg-cyber-green"></div>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
