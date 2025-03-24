
import React from 'react';
import ConnectWallet from '../components/ConnectWallet';
import ConfessionInput from '../components/ConfessionInput';
import ConfessionsList from '../components/ConfessionsList';
import AnimatedBackground from '../components/AnimatedBackground';
import { useWeb3 } from '../lib/web3';

const Index: React.FC = () => {
  const { connected } = useWeb3();

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-start">
      {/* Animated background with matrix rain effect */}
      <AnimatedBackground />
      
      {/* Connect wallet button */}
      <ConnectWallet />
      
      {/* Header */}
      <header className="w-full pt-16 pb-8 px-4 flex flex-col items-center">
        <div className="text-center mb-2 animate-text-flicker">
          <h1 className="cyber-text text-3xl sm:text-4xl md:text-5xl font-bold mb-1 tracking-widest">
            CONFESSIONS
          </h1>
          <div className="cyber-text text-sm sm:text-base text-opacity-70 tracking-wider">
            BRUTAL · ANONYMOUS · ONCHAIN
          </div>
        </div>
        
        <div className="h-px w-32 bg-cyber-green my-4 animate-glow"></div>
        
        <p className="cyber-text text-center max-w-md text-sm text-opacity-80">
          Speak your truth to the void. Confessions stored on-chain. Forever anonymous.
          <br />Never linked to your identity.
        </p>
      </header>
      
      {/* Main content */}
      <main className="w-full flex-1 flex flex-col items-center px-4 gap-8">
        {/* Input for typing confession */}
        <ConfessionInput />
        
        {/* Confessions listed as floating pills */}
        <ConfessionsList />
      </main>
      
      {/* Footer */}
      <footer className="w-full py-4 px-4 text-center">
        <div className="cyber-text text-xs text-opacity-50">
          CYPHERPUNK CONFESSIONS · BLOCKCHAIN SECURED · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
