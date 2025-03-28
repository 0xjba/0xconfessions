
import React, { useEffect, useState } from 'react';
import ConnectWallet from '../components/ConnectWallet';
import ConfessionInput from '../components/ConfessionInput';
import ConfessionsList from '../components/ConfessionsList';
import AnimatedBackground from '../components/AnimatedBackground';
import NoiseOverlay from '../components/NoiseOverlay';
import MobileWarning from '../components/MobileWarning';
import GlitchOverlay from '../components/GlitchOverlay';
import ConfessionSearch from '../components/ConfessionSearch';
import { useIsMobile } from '../hooks/use-mobile';
import { useWeb3 } from '../lib/web3';
import { Twitter } from 'lucide-react';

const Index: React.FC = () => {
  const { connected, totalConfessions } = useWeb3();
  const isMobile = useIsMobile();
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  
  useEffect(() => {
    if (isMobile) {
      // Check if the user has already acknowledged the mobile warning
      const mobileAcknowledged = window.localStorage.getItem('mobileAcknowledged');
      const bodyHasClass = document.body.classList.contains('mobile-acknowledged');
      
      if (!mobileAcknowledged && !bodyHasClass) {
        setShowMobileWarning(true);
      }
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-start">
      {/* Mobile warning dialog */}
      <MobileWarning open={showMobileWarning} />
      
      {/* Animated background with matrix rain effect */}
      <AnimatedBackground />
      
      {/* TV noise overlay */}
      <NoiseOverlay />
      
      {/* Scanlines and glitch effect overlay */}
      <GlitchOverlay />
      
      {/* Fixed position elements with added glass effect */}
      <div className="fixed top-0 left-0 right-0 z-40 h-20 bg-cyber-black/40 backdrop-blur-md"></div>
      <div className="fixed top-4 left-0 right-0 flex justify-between items-center z-50 px-4">
        {/* Search component - left */}
        <ConfessionSearch />
        
        {/* Total confessions counter - center - adjusted position with top-6 */}
        <div className="cyber-text text-sm tracking-wider animate-pulse-soft absolute left-1/2 transform -translate-x-1/2 top-6">
          TOTAL CONFESSIONS: <span className="text-white">{totalConfessions}</span>
        </div>
        
        {/* Connect wallet button - right */}
        <ConnectWallet />
      </div>
      
      {/* Header - added pt-24 to increase top padding */}
      <header className="w-full pt-24 pb-8 px-4 flex flex-col items-center">
        <div className="text-center mb-2 animate-text-flicker">
          <h1 className="cyber-text text-3xl sm:text-4xl md:text-5xl font-bold mb-1 tracking-widest">
            OxCONFESSIONS
          </h1>
          <div className="cyber-text text-sm sm:text-base text-opacity-70 tracking-wider">
            BRUTAL · ANONYMOUS · ONCHAIN
          </div>
        </div>
        
        <div className="h-px w-32 bg-cyber-green my-4 animate-glow"></div>
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
        <div className="cyber-text text-xs text-opacity-50 flex items-center justify-center gap-1">
          VIBECODED BY <a 
            href="https://x.com/0xjba" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-cyber-blue transition-colors duration-200 inline-flex items-center gap-1"
          >
            0XJBA <Twitter className="w-3 h-3 inline" />
          </a>
          <span className="mx-1">|</span>
          <a 
            href="https://github.com/0xjba/0xconfessions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-cyber-blue transition-colors duration-200 inline-flex items-center gap-1"
          >
            Github Repo
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
